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
): Promise<void> {
  try {
    const userInfo = getUserInfo(user)
    
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

    await addDoc(collection(db, COLLECTION_NAME), activity)
  } catch (error) {
    console.error('Error logging activity:', error)
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
    let q = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )

    if (entityType) {
      q = query(q, where('entityType', '==', entityType))
    }

    if (entityId) {
      q = query(q, where('entityId', '==', entityId))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ActivityLog[]
  } catch (error) {
    console.error('Error getting activities:', error)
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

