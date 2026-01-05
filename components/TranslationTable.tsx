'use client'

import React, { useMemo, useEffect } from 'react'
import { useTranslation } from '@/contexts/TranslationContext'
import PageSection from './PageSection'

interface TranslationTableProps {
  pages: string[]
  onAddSpace: (pageKey: string, path: string[]) => void
  onAddTranslation: (pageKey: string, path: string[]) => void
  onRenamePage: (pageKey: string) => void
  onDeletePage: (pageKey: string) => void
  onRenameSpace: (pageKey: string, path: string[], oldKey: string) => void
  onDeleteSpace: (pageKey: string, path: string[], spaceKey: string) => void
  onRenameTranslation: (pageKey: string, path: string[], oldKey: string) => void
  onDeleteTranslation: (pageKey: string, path: string[], key: string) => void
  onEditTranslation: (pageKey: string, path: string[], key: string) => void
  onChangeOrder: (pageKey: string, path: string[], key: string, type: 'space' | 'translation') => void
}

export default function TranslationTable({
  pages,
  onAddSpace,
  onAddTranslation,
  onRenamePage,
  onDeletePage,
  onRenameSpace,
  onDeleteSpace,
  onRenameTranslation,
  onDeleteTranslation,
  onEditTranslation,
  onChangeOrder,
}: TranslationTableProps) {
  const { translations, searchQuery, expandedPages, setSearchQuery, togglePage } = useTranslation()

  const checkDeepMatch = useMemo(() => {
    const checkDeepMatchFn = (container: any, query: string): boolean => {
      if (container.translations) {
        for (const key in container.translations) {
          if (key.toLowerCase().includes(query)) return true
          const values = container.translations[key]
          for (const lang in values) {
            const val = String(values[lang] || '')
            if (val.toLowerCase().includes(query)) return true
          }
        }
      }
      if (container.spaces) {
        for (const key in container.spaces) {
          if (key.toLowerCase().includes(query)) return true
          if (checkDeepMatchFn(container.spaces[key], query)) return true
        }
      }
      return false
    }
    return checkDeepMatchFn
  }, [])

  const visiblePages = useMemo(() => {
    if (!searchQuery) return pages

    const query = searchQuery.toLowerCase()
    return pages.filter(pageKey => {
      if (pageKey.toLowerCase().includes(query)) return true
      // Check if any child matches
      const page = translations[pageKey]
      if (!page) return false
      return checkDeepMatch(page, query)
    })
  }, [pages, searchQuery, translations, checkDeepMatch])

  // Auto-expand pages that match search
  useEffect(() => {
    if (searchQuery && visiblePages.length > 0) {
      visiblePages.forEach(pageKey => {
        if (!expandedPages.has(pageKey)) {
          togglePage(pageKey)
        }
      })
    }
  }, [searchQuery, visiblePages, expandedPages, togglePage])

  if (pages.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">📄</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No pages yet</h3>
          <p className="text-slate-500 mb-6">Start by adding a language, then create your first page.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                const event = new Event('click')
                document.querySelector('[data-add-language]')?.dispatchEvent(event)
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Add Language
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (visiblePages.length === 0 && searchQuery) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No matches found</h3>
          <p className="text-slate-500 mb-2">
            No results for &quot;<span className="font-semibold text-indigo-600">{searchQuery}</span>&quot;
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Clear Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {visiblePages.map(pageKey => (
        <PageSection
          key={pageKey}
          pageKey={pageKey}
          onAddSpace={onAddSpace}
          onAddTranslation={onAddTranslation}
          onRenamePage={onRenamePage}
          onDeletePage={onDeletePage}
          onRenameSpace={onRenameSpace}
          onDeleteSpace={onDeleteSpace}
          onRenameTranslation={onRenameTranslation}
          onDeleteTranslation={onDeleteTranslation}
          onEditTranslation={onEditTranslation}
          onChangeOrder={onChangeOrder}
        />
      ))}
    </div>
  )
}

