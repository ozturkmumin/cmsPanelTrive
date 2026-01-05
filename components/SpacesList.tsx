'use client'

import React, { useMemo, useEffect } from 'react'
import { useTranslation } from '@/contexts/TranslationContext'
import TranslationsTable from './TranslationsTable'

interface Space {
  translations: { [key: string]: { [lang: string]: any } }
  spaces: { [key: string]: Space }
  isArray?: boolean
}

interface SpacesListProps {
  pageKey: string
  path: string[]
  container: Space
  onAddSpace: (pageKey: string, path: string[]) => void
  onAddTranslation: (pageKey: string, path: string[]) => void
  onRenameSpace: (pageKey: string, path: string[], oldKey: string) => void
  onDeleteSpace: (pageKey: string, path: string[], spaceKey: string) => void
  onRenameTranslation: (pageKey: string, path: string[], oldKey: string) => void
  onDeleteTranslation: (pageKey: string, path: string[], key: string) => void
  onEditTranslation: (pageKey: string, path: string[], key: string) => void
  onChangeOrder: (pageKey: string, path: string[], key: string, type: 'space' | 'translation') => void
}

export default function SpacesList({
  pageKey,
  path,
  container,
  onAddSpace,
  onAddTranslation,
  onRenameSpace,
  onDeleteSpace,
  onRenameTranslation,
  onDeleteTranslation,
  onEditTranslation,
  onChangeOrder,
}: SpacesListProps) {
  const { expandedSpaces, toggleSpace, searchQuery } = useTranslation()

  const spaces = useMemo(() => {
    const isArray = container.isArray
    const sorted = Object.keys(container.spaces || {}).sort((a, b) => {
      if (isArray) {
        const nA = parseInt(a)
        const nB = parseInt(b)
        if (isNaN(nA) && isNaN(nB)) return a.localeCompare(b, 'tr', { sensitivity: 'base' })
        if (isNaN(nA)) return 1
        if (isNaN(nB)) return -1
        return nA - nB
      }
      return a.localeCompare(b, 'tr', { sensitivity: 'base' })
    })

    if (!searchQuery) return sorted

    const query = searchQuery.toLowerCase()
    return sorted.filter(s => {
      if (s.toLowerCase().includes(query)) return true
      return checkDeepMatch(container.spaces[s], query)
    })
  }, [container, searchQuery])

  const checkDeepMatch = (space: Space, query: string): boolean => {
    if (space.translations) {
      for (const key in space.translations) {
        if (key.toLowerCase().includes(query)) return true
        const values = space.translations[key]
        for (const lang in values) {
          const val = String(values[lang] || '')
          if (val.toLowerCase().includes(query)) return true
        }
      }
    }
    if (space.spaces) {
      for (const key in space.spaces) {
        if (key.toLowerCase().includes(query)) return true
        if (checkDeepMatch(space.spaces[key], query)) return true
      }
    }
    return false
  }

  // Auto-expand spaces that match search
  useEffect(() => {
    if (searchQuery && spaces.length > 0) {
      spaces.forEach(spaceKey => {
        const spacePath = pageKey + (path.length ? "::" + path.join("::") : "") + "::" + spaceKey
        if (!expandedSpaces.has(spacePath)) {
          toggleSpace(pageKey, [...path, spaceKey])
        }
      })
    }
  }, [searchQuery, spaces, pageKey, path, expandedSpaces, toggleSpace])

  if (spaces.length === 0 && path.length === 0) {
    if (searchQuery) return null
    return <div className="text-sm text-slate-400 italic px-2">No spaces yet. Add one to start translating.</div>
  }

  return (
    <>
      {spaces.map(s => {
        const currentPath = [...path, s]
        const uniquePath = pageKey + "::" + currentPath.join("::")
        const isExpanded = expandedSpaces.has(uniquePath)
        const space = container.spaces[s]
        const isArray = space.isArray
        const num = parseInt(s)
        const order = (isArray && !isNaN(num)) ? num + 1 : '-'
        const selfMatch = searchQuery ? s.toLowerCase().includes(searchQuery.toLowerCase()) : false

        return (
          <div key={s} className="ml-4 border-l-2 border-slate-300 pl-4 mt-4">
            <div className="flex justify-between items-center group/space cursor-pointer sticky top-0 bg-white/95 backdrop-blur z-10 py-2 border-b border-transparent hover:border-slate-100 transition-colors">
              <div className="flex items-center gap-2">
                <div
                  className="p-1 rounded hover:bg-slate-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSpace(pageKey, currentPath)
                  }}
                >
                  {isExpanded ? (
                    <svg className="w-4 h-4 text-slate-400 transition-transform duration-200 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-slate-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                  {isArray && order !== '-' ? (
                    <span className="text-xs text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">#{order}</span>
                  ) : (
                    s
                  )}
                  {isArray && (
                    <span className="ml-2 inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-purple-200" title="Array">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Array
                    </span>
                  )}
                  {selfMatch && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Match</span>
                  )}
                  {isArray && order !== '-' && (
                    <button
                      className="text-slate-300 hover:text-indigo-600 opacity-0 group-hover/space:opacity-100 transition-opacity p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        onChangeOrder(pageKey, path, s, 'space')
                      }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </h3>
                <button
                  className="text-xs px-2 py-1 text-indigo-600 hover:text-indigo-700 font-medium ml-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddSpace(pageKey, currentPath)
                  }}
                >
                  {isArray ? '+ Add Object' : '+ Add Sub-Space'}
                </button>
                {!isArray && (
                  <button
                    className="text-xs px-2 py-1 text-emerald-600 hover:text-emerald-700 font-medium"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddTranslation(pageKey, currentPath)
                    }}
                  >
                    + Add Translation
                  </button>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover/space:opacity-100 transition-opacity">
                {!isArray && (
                  <button
                    className="text-xs px-2 py-1 text-slate-500 hover:text-indigo-600 font-medium"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRenameSpace(pageKey, path, s)
                    }}
                  >
                    Rename
                  </button>
                )}
                <button
                  className="text-xs px-2 py-1 text-slate-500 hover:text-red-600 font-medium"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSpace(pageKey, path, s)
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-3">
                <TranslationsTable
                  pageKey={pageKey}
                  path={currentPath}
                  translations={space.translations}
                  isParentArray={isArray || false}
                  onRename={onRenameTranslation}
                  onDelete={onDeleteTranslation}
                  onEdit={onEditTranslation}
                  onChangeOrder={onChangeOrder}
                />
                <SpacesList
                  pageKey={pageKey}
                  path={currentPath}
                  container={space}
                  onAddSpace={onAddSpace}
                  onAddTranslation={onAddTranslation}
                  onRenameSpace={onRenameSpace}
                  onDeleteSpace={onDeleteSpace}
                  onRenameTranslation={onRenameTranslation}
                  onDeleteTranslation={onDeleteTranslation}
                  onEditTranslation={onEditTranslation}
                  onChangeOrder={onChangeOrder}
                />
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

