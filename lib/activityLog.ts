import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { ActivityLog } from '@/types/activity'
import { User } from 'firebase/auth'

const COLLECTION_NAME = 'activityLogs'

// Get current user info
function getUserInfo(user: User | null) {
  if (!user) {
    return {
      userId: 'anonymous',
      userEmail: 'anonymous@unknown.com',
      userName: 'Anonymous',
    }
  }
  return {
    userId: user.uid,
    userEmail: user.email || 'unknown@unknown.com',
    userName: user.displayName || user.email?.split('@')[0] || 'Unknown User',
  }
}

// Log an activity
export async function logActivity(
  user: User | null,
  action: ActivityLog['action'],
  entityType: ActivityLog['entityType'],
  options: {
    entityId?: string
    entityName?: string
    details?: string
    changes?: ActivityLog['changes']
  } = {}
): Promise<string | void> {
  let userInfo
  try {
    userInfo = getUserInfo(user)
    
    const activity: Omit<ActivityLog, 'id'> = {
      ...userInfo,
      action,
      entityType,
      entityId: options.entityId,
      entityName: options.entityName,
      details: options.details,
      changes: options.changes,
      timestamp: new Date().toISOString(),
    }

    console.log('Logging activity:', activity)
    
    // Check if db is initialized
    if (!db) {
      console.error('Firestore db is not initialized')
      return
    }
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), activity)
    console.log('✅ Activity logged successfully with ID:', docRef.id)
    return docRef.id
  } catch (error: any) {
    console.error('❌ Error logging activity:', error)
    console.error('Error details:', {
      collection: COLLECTION_NAME,
      user: userInfo || { userId: 'unknown', userEmail: 'unknown' },
      action,
      entityType,
      errorMessage: error?.message,
      errorCode: error?.code,
    })
    
    // Show alert for permission errors
    if (error?.code === 'permission-denied') {
      console.error('⚠️ Permission denied! Check Firestore rules.')
    }
    
    // Don't throw - activity logging shouldn't break the app
  }
}

// Get recent activities
export async function getRecentActivities(
  limitCount: number = 50,
  entityType?: ActivityLog['entityType'],
  entityId?: string
): Promise<ActivityLog[]> {
  try {
    let q: any = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )

    if (entityType) {
      q = query(
        collection(db, COLLECTION_NAME),
        where('entityType', '==', entityType),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      )
    }

    if (entityId) {
      if (entityType) {
        q = query(
          collection(db, COLLECTION_NAME),
          where('entityType', '==', entityType),
          where('entityId', '==', entityId),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        )
      } else {
        q = query(
          collection(db, COLLECTION_NAME),
          where('entityId', '==', entityId),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        )
      }
    }

    const querySnapshot = await getDocs(q)
    const activities = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ActivityLog[]
    
    console.log(`Found ${activities.length} activities from Firestore`)
    return activities
  } catch (error) {
    console.error('Error getting activities:', error)
    // If there's an index error, try without filters
    if (error instanceof Error && (error.message.includes('index') || error.message.includes('requires an index'))) {
      try {
        const simpleQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        )
        const querySnapshot = await getDocs(simpleQuery)
        let results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ActivityLog[]
        
        // Filter in memory if needed
        if (entityType) {
          results = results.filter(a => a.entityType === entityType)
        }
        if (entityId) {
          results = results.filter(a => a.entityId === entityId)
        }
        
        return results
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError)
      }
    }
    return []
  }
}

// Get activities for a specific entity
export async function getEntityActivities(
  entityType: ActivityLog['entityType'],
  entityId: string,
  limitCount: number = 20
): Promise<ActivityLog[]> {
  return getRecentActivities(limitCount, entityType, entityId)
}

// Get user activities
export async function getUserActivities(
  userId: string,
  limitCount: number = 50
): Promise<ActivityLog[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ActivityLog[]
  } catch (error) {
    console.error('Error getting user activities:', error)
    return []
  }
}

