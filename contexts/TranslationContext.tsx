'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { saveTranslations, saveLanguages, subscribeToData, getTranslations, getLanguages } from '@/lib/firestore'
import { logActivity } from '@/lib/activityLog'
import { getCurrentUser } from '@/lib/auth'

interface TranslationValue {
  [lang: string]: string | number | boolean | null
}

interface Space {
  translations: { [key: string]: TranslationValue }
  spaces: { [key: string]: Space }
  isArray?: boolean
}

interface Translations {
  [pageKey: string]: Space
}

interface TranslationContextType {
  translations: Translations
  languages: string[]
  expandedPages: Set<string>
  expandedSpaces: Set<string>
  searchQuery: string
  addLanguage: (code: string) => void
  deleteLanguage: (code: string) => void
  renameLanguage: (oldCode: string, newCode: string) => void
  addPage: (pageKey: string) => void
  deletePage: (pageKey: string) => void
  renamePage: (oldKey: string, newKey: string) => void
  addSpace: (pageKey: string, parentPath: string[], spaceKey: string, isArray?: boolean) => void
  deleteSpace: (pageKey: string, parentPath: string[], spaceKey: string) => void
  renameSpace: (pageKey: string, parentPath: string[], oldKey: string, newKey: string) => void
  addTranslation: (pageKey: string, parentPath: string[], key: string, values?: { [lang: string]: any }) => void
  deleteTranslation: (pageKey: string, parentPath: string[], key: string) => void
  renameTranslationKey: (pageKey: string, parentPath: string[], oldKey: string, newKey: string) => void
  updateTranslationValue: (pageKey: string, parentPath: string[], key: string, lang: string, value: any) => void
  togglePage: (pageKey: string) => void
  toggleSpace: (pageKey: string, path: string[]) => void
  setSearchQuery: (query: string) => void
  importTranslations: (lang: string, data: any) => void
  getTranslationsByLang: (lang: string) => any
  getSpaceContainer: (pageKey: string, pathArray: string[]) => Space | null
  isValidKey: (k: string) => boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<Translations>({})
  const [languages, setLanguages] = useState<string[]>([])
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set())
  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const isValidKey = useCallback((k: string) => {
    return typeof k === "string" && k.trim() !== "" && !/\s/.test(k)
  }, [])

  const getSpaceContainer = useCallback((pageKey: string, pathArray: string[]): Space | null => {
    let current = translations[pageKey]
    if (!current) return null
    for (const key of pathArray) {
      if (!current || !current.spaces || !current.spaces[key]) return null
      current = current.spaces[key]
    }
    return current
  }, [translations])

  const saveData = useCallback(async () => {
    if (isSaving) {
      console.log('⏳ Already saving, skipping...')
      return
    }
    
    setIsSaving(true)
    try {
      console.log('💾 Saving translations to Firestore...', { 
        pages: Object.keys(translations).length,
        languages: languages.length 
      })
      await Promise.all([
        saveTranslations(translations),
        saveLanguages(languages)
      ])
      console.log('✅ Successfully saved translations to Firestore')
    } catch (e: any) {
      console.error("❌ Failed to save to Firestore:", e)
      console.error("Error details:", {
        message: e.message,
        code: e.code,
        stack: e.stack
      })
      // Fallback to localStorage if Firestore fails
      try {
        localStorage.setItem("tm_data", JSON.stringify(translations))
        localStorage.setItem("tm_langs", JSON.stringify(languages))
        console.log('✅ Saved to localStorage as fallback')
      } catch (localError) {
        console.error("❌ Failed to save to localStorage:", localError)
      }
    } finally {
      setIsSaving(false)
    }
  }, [translations, languages, isSaving])

  const loadData = useCallback(async () => {
    try {
      const [data, langs] = await Promise.all([
        getTranslations(),
        getLanguages()
      ])
      
      setTranslations(data)
      setLanguages(langs)
    } catch (e) {
      console.error("Failed to load from Firestore:", e)
      // Fallback to localStorage
      try {
        const dataStr = localStorage.getItem("tm_data")
        const langsStr = localStorage.getItem("tm_langs")
        
        if (dataStr && langsStr) {
          const data = JSON.parse(dataStr)
          const langs = JSON.parse(langsStr)
          
          setTranslations(data)
          setLanguages(langs)
        }
      } catch (localError) {
        console.error("Failed to load from localStorage:", localError)
      }
    }
  }, [])

  // Real-time subscription to Firestore
  useEffect(() => {
    let isMounted = true
    let unsubscribe: (() => void) | null = null
    
    // Initial load first, then subscribe
    loadData().then(() => {
      if (!isMounted) return
      
      // Then subscribe to real-time updates
      unsubscribe = subscribeToData((data) => {
        if (isMounted && !isSaving) {
          // Only update if we're not currently saving (to prevent circular updates)
          console.log('📥 Received real-time update from Firestore')
          setTranslations(data.translations)
          setLanguages(data.languages)
        }
      })
    })

    return () => {
      isMounted = false
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [isSaving]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save to Firestore when data changes (debounced)
  useEffect(() => {
    // Skip save on initial mount or if data is empty
    if (isInitialLoad) {
      setIsInitialLoad(false)
      return
    }

    if (translations && Object.keys(translations).length === 0 && languages.length === 0) {
      return
    }

    console.log('🔄 Translation data changed, scheduling save...')
    const timer = setTimeout(() => {
      saveData()
    }, 1000) // Debounce: save 1 second after last change

    return () => clearTimeout(timer)
  }, [translations, languages, saveData, isInitialLoad])

  const addLanguage = useCallback((code: string) => {
    if (!isValidKey(code)) throw new Error("Invalid language code")
    if (languages.includes(code)) throw new Error("Language already exists")
    setLanguages(prev => [...prev, code])
  }, [languages, isValidKey])

  const deleteLanguage = useCallback((code: string) => {
    setLanguages(prev => prev.filter(l => l !== code))
    setTranslations(prev => {
      const newTranslations = { ...prev }
      const removeLangFromTranslations = (space: Space): Space => {
        const newSpace: Space = { translations: {}, spaces: {} }
        if (space.isArray !== undefined) newSpace.isArray = space.isArray
        
        for (const key in space.translations) {
          const trans = { ...space.translations[key] }
          delete trans[code]
          if (Object.keys(trans).length > 0) {
            newSpace.translations[key] = trans
          }
        }
        
        for (const key in space.spaces) {
          newSpace.spaces[key] = removeLangFromTranslations(space.spaces[key])
        }
        
        return newSpace
      }
      
      for (const pageKey in newTranslations) {
        newTranslations[pageKey] = removeLangFromTranslations(newTranslations[pageKey])
      }
      
      return newTranslations
    })
  }, [])

  const renameLanguage = useCallback((oldCode: string, newCode: string) => {
    if (!isValidKey(newCode)) throw new Error("Invalid language code")
    if (languages.includes(newCode) && newCode !== oldCode) throw new Error("Language already exists")
    
    setLanguages(prev => prev.map(l => l === oldCode ? newCode : l))
    setTranslations(prev => {
      const newTranslations = { ...prev }
      const renameLangInTranslations = (space: Space): Space => {
        const newSpace: Space = { translations: {}, spaces: {} }
        if (space.isArray !== undefined) newSpace.isArray = space.isArray
        
        for (const key in space.translations) {
          const trans = { ...space.translations[key] }
          if (trans[oldCode] !== undefined) {
            trans[newCode] = trans[oldCode]
            delete trans[oldCode]
          }
          newSpace.translations[key] = trans
        }
        
        for (const key in space.spaces) {
          newSpace.spaces[key] = renameLangInTranslations(space.spaces[key])
        }
        
        return newSpace
      }
      
      for (const pageKey in newTranslations) {
        newTranslations[pageKey] = renameLangInTranslations(newTranslations[pageKey])
      }
      
      return newTranslations
    })
  }, [languages, isValidKey])

  const addPage = useCallback((pageKey: string) => {
    if (!isValidKey(pageKey)) throw new Error("Invalid page key")
    if (translations[pageKey]) throw new Error("Page already exists")
    
    setTranslations(prev => ({
      ...prev,
      [pageKey]: { translations: {}, spaces: {} }
    }))
    setExpandedPages(prev => new Set(prev).add(pageKey))

    // Log activity
    const user = getCurrentUser()
    logActivity(user, 'create', 'page', {
      entityId: pageKey,
      entityName: pageKey,
      details: `Created new translation page: ${pageKey}`,
    }).catch(err => {
      console.error('❌ Failed to log page create activity:', err)
    })
  }, [translations, isValidKey])

  const deletePage = useCallback((pageKey: string) => {
    setTranslations(prev => {
      const newTranslations = { ...prev }
      delete newTranslations[pageKey]
      return newTranslations
    })
    setExpandedPages(prev => {
      const newSet = new Set(prev)
      newSet.delete(pageKey)
      return newSet
    })

    // Log activity
    const user = getCurrentUser()
    logActivity(user, 'delete', 'page', {
      entityId: pageKey,
      entityName: pageKey,
      details: `Deleted translation page: ${pageKey}`,
    }).catch(err => {
      console.error('❌ Failed to log page delete activity:', err)
    })
  }, [])

  const renamePage = useCallback((oldKey: string, newKey: string) => {
    if (!isValidKey(newKey)) throw new Error("Invalid page key")
    if (translations[newKey] && newKey !== oldKey) throw new Error("Page already exists")
    
    setTranslations(prev => {
      const newTranslations = { ...prev }
      if (newTranslations[oldKey]) {
        newTranslations[newKey] = newTranslations[oldKey]
        delete newTranslations[oldKey]
      }
      return newTranslations
    })
    
    setExpandedPages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(oldKey)) {
        newSet.delete(oldKey)
        newSet.add(newKey)
      }
      return newSet
    })

    // Log activity
    const user = getCurrentUser()
    logActivity(user, 'update', 'page', {
      entityId: oldKey,
      entityName: `${oldKey} → ${newKey}`,
      details: `Renamed page from ${oldKey} to ${newKey}`,
      changes: [{
        field: 'pageKey',
        oldValue: oldKey,
        newValue: newKey,
      }],
    }).catch(err => {
      console.error('❌ Failed to log page rename activity:', err)
    })
  }, [translations, isValidKey])

  const addSpace = useCallback((pageKey: string, parentPath: string[], spaceKey: string, isArray = false) => {
    const container = getSpaceContainer(pageKey, parentPath)
    if (!container) throw new Error("Parent not found")
    if (!isValidKey(spaceKey)) throw new Error("Invalid space key")
    if (container.spaces && container.spaces[spaceKey]) throw new Error("Space key already exists")
    
    setTranslations(prev => {
      const newTranslations = { ...prev }
      let current: Space = newTranslations[pageKey]
      for (const key of parentPath) {
        current = current.spaces[key]
      }
      if (!current.spaces) current.spaces = {}
      current.spaces[spaceKey] = { translations: {}, spaces: {}, isArray }
      return newTranslations
    })
    
    setExpandedPages(prev => new Set(prev).add(pageKey))
    setExpandedSpaces(prev => {
      const newSet = new Set(prev)
      let currentP = pageKey
      for (const p of parentPath) {
        currentP += "::" + p
        newSet.add(currentP)
      }
      return newSet
    })
  }, [getSpaceContainer, isValidKey])

  const deleteSpace = useCallback((pageKey: string, parentPath: string[], spaceKey: string) => {
    setTranslations(prev => {
      const newTranslations = { ...prev }
      let current: Space = newTranslations[pageKey]
      for (const key of parentPath) {
        current = current.spaces[key]
      }
      if (current.spaces) {
        delete current.spaces[spaceKey]
      }
      return newTranslations
    })
  }, [])

  const renameSpace = useCallback((pageKey: string, parentPath: string[], oldKey: string, newKey: string) => {
    const container = getSpaceContainer(pageKey, parentPath)
    if (!container) throw new Error("Parent not found")
    if (oldKey === newKey) return
    if (!isValidKey(newKey)) throw new Error("Invalid space key")
    if (container.spaces[newKey]) throw new Error("Space key exists")
    
    setTranslations(prev => {
      const newTranslations = { ...prev }
      let current: Space = newTranslations[pageKey]
      for (const key of parentPath) {
        current = current.spaces[key]
      }
      current.spaces[newKey] = current.spaces[oldKey]
      delete current.spaces[oldKey]
      return newTranslations
    })
    
    setExpandedSpaces(prev => {
      const newSet = new Set(prev)
      const parentPrefix = pageKey + (parentPath.length ? "::" + parentPath.join("::") : "")
      const oldPath = parentPrefix + "::" + oldKey
      const newPath = parentPrefix + "::" + newKey
      if (newSet.has(oldPath)) {
        newSet.delete(oldPath)
        newSet.add(newPath)
      }
      return newSet
    })
  }, [getSpaceContainer, isValidKey])

  const addTranslation = useCallback(async (pageKey: string, parentPath: string[], key: string, values?: { [lang: string]: any }) => {
    const container = getSpaceContainer(pageKey, parentPath)
    if (!container) throw new Error("Space not found")
    if (!isValidKey(key)) throw new Error("Invalid key")
    if (container.translations && container.translations[key]) throw new Error("Key exists")
    
    setTranslations(prev => {
      const newTranslations = { ...prev }
      let current: Space = newTranslations[pageKey]
      for (const p of parentPath) {
        current = current.spaces[p]
      }
      if (!current.translations) current.translations = {}
      
      const obj: TranslationValue = {}
      languages.forEach(l => obj[l] = values && values[l] ? values[l] : "")
      current.translations[key] = obj
      
      return newTranslations
    })
    
    setExpandedPages(prev => new Set(prev).add(pageKey))
    setExpandedSpaces(prev => {
      const newSet = new Set(prev)
      let currentP = pageKey
      for (const p of parentPath) {
        currentP += "::" + p
        newSet.add(currentP)
      }
      return newSet
    })

    // Log activity
    const user = getCurrentUser()
    logActivity(user, 'create', 'translation', {
      entityId: `${pageKey}/${parentPath.join('/')}/${key}`,
      entityName: key,
      details: `Created new translation key: ${key}`,
    }).catch(err => {
      console.error('❌ Failed to log translation create activity:', err)
    })
  }, [getSpaceContainer, isValidKey, languages])

  const deleteTranslation = useCallback(async (pageKey: string, parentPath: string[], key: string) => {
    const user = getCurrentUser()
    
    setTranslations(prev => {
      const newTranslations = { ...prev }
      let current: Space = newTranslations[pageKey]
      for (const p of parentPath) {
        current = current.spaces[p]
      }
      if (current.translations) {
        delete current.translations[key]
      }
      return newTranslations
    })

    // Log activity
    logActivity(user, 'delete', 'translation', {
      entityId: `${pageKey}/${parentPath.join('/')}/${key}`,
      entityName: key,
      details: `Deleted translation key: ${key}`,
    }).catch(err => {
      console.error('❌ Failed to log translation delete activity:', err)
    })
  }, [])

  const renameTranslationKey = useCallback((pageKey: string, parentPath: string[], oldKey: string, newKey: string) => {
    const container = getSpaceContainer(pageKey, parentPath)
    if (!container) return
    if (oldKey === newKey) return
    if (!isValidKey(newKey)) throw new Error("Invalid key")
    if (container.translations && container.translations[newKey]) throw new Error("Key exists")
    
    setTranslations(prev => {
      const newTranslations = { ...prev }
      let current: Space = newTranslations[pageKey]
      for (const p of parentPath) {
        current = current.spaces[p]
      }
      if (current.translations) {
        current.translations[newKey] = current.translations[oldKey]
        delete current.translations[oldKey]
      }
      return newTranslations
    })
  }, [getSpaceContainer, isValidKey])

  const updateTranslationValue = useCallback((pageKey: string, parentPath: string[], key: string, lang: string, value: any) => {
    const user = getCurrentUser()
    const oldValue = translations[pageKey]?.spaces?.[parentPath[0]]?.translations?.[key]?.[lang]
    
    setTranslations(prev => {
      const newTranslations = { ...prev }
      let current: Space = newTranslations[pageKey]
      for (const p of parentPath) {
        current = current.spaces[p]
      }
      if (current.translations && current.translations[key]) {
        current.translations[key][lang] = value
      }
      return newTranslations
    })

    // Log activity (fire and forget)
    if (oldValue !== value) {
      logActivity(user, 'update', 'translation', {
        entityId: `${pageKey}/${parentPath.join('/')}/${key}`,
        entityName: `${key} (${lang})`,
        details: `Updated translation value for ${lang}`,
        changes: [{
          field: lang,
          oldValue: oldValue,
          newValue: value,
        }],
      }).catch(err => {
        console.error('❌ Failed to log translation update activity:', err)
        console.error('Activity details:', {
          pageKey,
          path: parentPath,
          key,
          lang,
          oldValue,
          newValue: value,
        })
      })
    }
  }, [translations])

  const togglePage = useCallback((pageKey: string) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(pageKey)) {
        newSet.delete(pageKey)
      } else {
        newSet.add(pageKey)
      }
      return newSet
    })
  }, [])

  const toggleSpace = useCallback((pageKey: string, path: string[]) => {
    const spacePath = pageKey + (path.length ? "::" + path.join("::") : "")
    setExpandedSpaces(prev => {
      const newSet = new Set(prev)
      if (newSet.has(spacePath)) {
        newSet.delete(spacePath)
      } else {
        newSet.add(spacePath)
      }
      return newSet
    })
  }, [])

  const getTranslationsByLang = useCallback((lang: string) => {
    const out: any = { [lang]: {} }
    
    const recurse = (container: Space): any => {
      if (container.isArray) {
        const arr: any[] = []
        const indices: number[] = []
        
        for (const s in container.spaces) {
          if (!isNaN(parseInt(s))) indices.push(parseInt(s))
        }
        for (const t in container.translations) {
          if (!isNaN(parseInt(t))) indices.push(parseInt(t))
        }
        
        if (indices.length > 0) {
          const maxIndex = Math.max(...indices)
          for (let i = 0; i <= maxIndex; i++) {
            const key = String(i)
            if (container.spaces[key]) {
              arr[i] = recurse(container.spaces[key])
            } else if (container.translations[key]) {
              arr[i] = container.translations[key][lang] || ""
            } else {
              arr[i] = null
            }
          }
        }
        return arr
      }
      
      const res: any = {}
      for (const s in container.spaces) {
        res[s] = recurse(container.spaces[s])
      }
      for (const t in container.translations) {
        res[t] = container.translations[t][lang] || ""
      }
      return res
    }
    
    for (const p in translations) {
      out[lang][p] = recurse(translations[p])
    }
    return out
  }, [translations])

  const importTranslations = useCallback((lang: string, data: any) => {
    // Add language if it doesn't exist
    if (!languages.includes(lang)) {
      addLanguage(lang)
    }
    
    setTranslations(prev => {
      const newTranslations = JSON.parse(JSON.stringify(prev)) // Deep copy
      // Use current languages, add lang if not present
      const currentLangs = languages.includes(lang) ? languages : [...languages, lang]
      
      // Helper to get or create container
      const getOrCreateContainer = (pageKey: string, path: string[]): Space => {
        let current: Space = newTranslations[pageKey]
        if (!current) {
          newTranslations[pageKey] = { translations: {}, spaces: {} }
          current = newTranslations[pageKey]
        }
        
        for (const key of path) {
          if (!current.spaces) current.spaces = {}
          if (!current.spaces[key]) {
            current.spaces[key] = { translations: {}, spaces: {} }
          }
          current = current.spaces[key]
        }
        
        if (!current.translations) current.translations = {}
        if (!current.spaces) current.spaces = {}
        
        return current
      }
      
      const mergeRecursive = (pageKey: string, path: string[], obj: any) => {
        const container = getOrCreateContainer(pageKey, path)
        
        // Handle arrays
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            const key = String(index)
            if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean' || item === null) {
              // Primitive value in array
              if (!container.translations[key]) {
                const trans: TranslationValue = {}
                currentLangs.forEach(l => {
                  trans[l] = l === lang ? item : (typeof item === 'number' ? 0 : typeof item === 'boolean' ? false : null)
                })
                container.translations[key] = trans
              } else {
                container.translations[key][lang] = item
              }
            } else if (typeof item === 'object' && item !== null) {
              // Object in array
              if (!container.spaces[key]) {
                container.spaces[key] = { translations: {}, spaces: {}, isArray: Array.isArray(item) }
              }
              mergeRecursive(pageKey, [...path, key], item)
            }
          })
          return
        }
        
        // Handle objects
        const keys = Object.keys(obj)
        for (const key of keys) {
          if (!isValidKey(key)) continue
          
          const val = obj[key]
          
          // Handle primitive values (string, number, boolean, null)
          if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean' || val === null) {
            // Skip if it's already a space
            if (container.spaces[key]) {
              console.warn(`Skipping key '${key}' at path ${path.join('/')}: It is already a Space.`)
              continue
            }
            
            // Update or create translation
            if (container.translations[key]) {
              container.translations[key][lang] = val
            } else {
              const trans: TranslationValue = {}
              currentLangs.forEach(l => {
                if (l === lang) {
                  trans[l] = val
                } else {
                  // Set default value based on type
                  if (typeof val === 'number') trans[l] = 0
                  else if (typeof val === 'boolean') trans[l] = false
                  else if (val === null) trans[l] = null
                  else trans[l] = ""
                }
              })
              container.translations[key] = trans
            }
          } 
          // Handle objects and arrays
          else if (typeof val === 'object' && val !== null) {
            // Skip if it's already a translation
            if (container.translations[key]) {
              console.warn(`Skipping key '${key}' at path ${path.join('/')}: It is already a Translation.`)
              continue
            }
            
            const isArray = Array.isArray(val)
            
            // Create space if it doesn't exist
            if (!container.spaces[key]) {
              container.spaces[key] = { translations: {}, spaces: {}, isArray }
            } else if (isArray) {
              container.spaces[key].isArray = true
            }
            
            // Recurse into the object/array
            mergeRecursive(pageKey, [...path, key], val)
          }
        }
      }
      
      // Process each page in the data
      for (const pageKey in data) {
        if (!isValidKey(pageKey)) {
          console.warn(`Invalid page key: ${pageKey}`)
          continue
        }
        
        if (!newTranslations[pageKey]) {
          newTranslations[pageKey] = { translations: {}, spaces: {} }
        }
        
        mergeRecursive(pageKey, [], data[pageKey])
      }
      
      return newTranslations
    })
  }, [languages, addLanguage, isValidKey])

  return (
    <TranslationContext.Provider value={{
      translations,
      languages,
      expandedPages,
      expandedSpaces,
      searchQuery,
      addLanguage,
      deleteLanguage,
      renameLanguage,
      addPage,
      deletePage,
      renamePage,
      addSpace,
      deleteSpace,
      renameSpace,
      addTranslation,
      deleteTranslation,
      renameTranslationKey,
      updateTranslationValue,
      togglePage,
      toggleSpace,
      setSearchQuery,
      importTranslations,
      getTranslationsByLang,
      getSpaceContainer,
      isValidKey,
    }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

