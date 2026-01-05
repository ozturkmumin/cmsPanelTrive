import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from './firebase'
import { Page } from '@/types/pageBuilder'
import { logActivity } from './activityLog'
import { getCurrentUser } from './auth'

const COLLECTION_NAME = 'pages'

// Get all pages
export async function getPages(): Promise<Page[]> {
  try {
    const pagesRef = collection(db, COLLECTION_NAME)
    const q = query(pagesRef, orderBy('updatedAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || 'Untitled',
        slug: data.slug || 'untitled',
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
        meta: data.meta || {},
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Page
    })
  } catch (error) {
    console.error('Error getting pages:', error)
    return []
  }
}

// Get a single page by ID
export async function getPage(pageId: string): Promise<Page | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, pageId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      // Ensure blocks array exists and is properly formatted
      const page: Page = {
        id: docSnap.id,
        name: data.name || 'Untitled',
        slug: data.slug || 'untitled',
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
        meta: data.meta || {},
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
      console.log('Loaded page from Firestore:', page)
      return page
    }
    return null
  } catch (error) {
    console.error('Error getting page:', error)
    return null
  }
}

// Get a page by slug
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const pagesRef = collection(db, COLLECTION_NAME)
    const q = query(pagesRef, where('slug', '==', slug))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as Page
    }
    return null
  } catch (error) {
    console.error('Error getting page by slug:', error)
    return null
  }
}

// Save a page
export async function savePage(page: Page): Promise<string> {
  try {
    // Ensure blocks array exists and is properly formatted
    const blocks = Array.isArray(page.blocks) ? page.blocks.map((block: any) => ({
      id: block.id || `block-${Date.now()}-${Math.random()}`,
      type: block.type || 'text',
      data: block.data || {},
      styles: block.styles || {},
      order: typeof block.order === 'number' ? block.order : 0,
    })) : []
    
    const pageData = {
      name: page.name || 'Untitled',
      slug: page.slug || 'untitled',
      blocks: blocks,
      meta: page.meta || {},
      updatedAt: new Date().toISOString(),
      createdAt: page.createdAt || new Date().toISOString(),
    }
    
    console.log('Saving page to Firestore:', {
      ...pageData,
      blocksCount: blocks.length,
    })
    
    const user = getCurrentUser()
    
    if (page.id && page.id !== 'new-page') {
      // Update existing page - use setDoc with merge: false to replace entire document
      const docRef = doc(db, COLLECTION_NAME, page.id)
      await setDoc(docRef, pageData)
      console.log('Page updated:', page.id, 'Blocks:', blocks.length)
      
      // Log activity
      await logActivity(user, 'update', 'page', {
        entityId: page.id,
        entityName: pageData.name,
        details: `Updated page with ${blocks.length} blocks`,
      })
      
      return page.id
    } else {
      // Create new page
      const docRef = doc(collection(db, COLLECTION_NAME))
      await setDoc(docRef, pageData)
      console.log('Page created:', docRef.id, 'Blocks:', blocks.length)
      
      // Log activity
      await logActivity(user, 'create', 'page', {
        entityId: docRef.id,
        entityName: pageData.name,
        details: `Created new page with ${blocks.length} blocks`,
      })
      
      return docRef.id
    }
  } catch (error) {
    console.error('Error saving page:', error)
    throw error
  }
}

// Delete a page
export async function deletePage(pageId: string): Promise<void> {
  try {
    // Get page data before deleting for logging
    const pageDoc = await getDoc(doc(db, COLLECTION_NAME, pageId))
    const pageData = pageDoc.data()
    
    const docRef = doc(db, COLLECTION_NAME, pageId)
    await deleteDoc(docRef)
    
    // Log activity
    const user = getCurrentUser()
    await logActivity(user, 'delete', 'page', {
      entityId: pageId,
      entityName: pageData?.name || 'Unknown',
      details: 'Deleted page',
    })
  } catch (error) {
    console.error('Error deleting page:', error)
    throw error
  }
}

