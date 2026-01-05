'use client'

import React, { useMemo } from 'react'
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
  const { translations, searchQuery, expandedPages, setSearchQuery } = useTranslation()

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
  }, [pages, searchQuery, translations])

  const checkDeepMatch = (container: any, query: string): boolean => {
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
        if (checkDeepMatch(container.spaces[key], query)) return true
      }
    }
    return false
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-slate-500 mb-4">No content yet.</p>
        <p className="text-sm text-slate-400">Start by adding a language, then create your first page.</p>
      </div>
    )
  }

  if (visiblePages.length === 0 && searchQuery) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-slate-500 mb-4">
          No matches found for &quot;<b>{searchQuery}</b>&quot;
        </p>
        <button
          onClick={() => setSearchQuery('')}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Clear Search
        </button>
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

