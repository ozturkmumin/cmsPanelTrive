'use client'

import React from 'react'
import { useTranslation } from '@/contexts/TranslationContext'
import TranslationsTable from './TranslationsTable'
import SpacesList from './SpacesList'
import LastActivityBadge from './LastActivityBadge'

interface PageSectionProps {
  pageKey: string
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

export default function PageSection({
  pageKey,
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
}: PageSectionProps) {
  const { translations, expandedPages, togglePage, searchQuery } = useTranslation()
  
  const page = translations[pageKey]
  if (!page) return null

  const isExpanded = expandedPages.has(pageKey)
  const isMatch = searchQuery ? pageKey.toLowerCase().includes(searchQuery.toLowerCase()) : false

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200 animate-fade-in">
      <div
        className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center group cursor-pointer hover:from-indigo-50/30 transition-all duration-200"
        onClick={() => togglePage(pageKey)}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1.5">
              <h2 className="text-lg font-bold text-slate-800">
                {pageKey}
                {isMatch && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Match</span>
                )}
              </h2>
            </div>
            <div className="mt-1">
              <LastActivityBadge
                entityType="page"
                entityId={pageKey}
                compact={false}
              />
            </div>
          </div>
          <div className="flex gap-2 ml-2">
            <button
              className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-indigo-600 rounded-md hover:bg-indigo-50 font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onAddSpace(pageKey, [])
              }}
            >
              + Add Space
            </button>
            <button
              className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-emerald-600 rounded-md hover:bg-emerald-50 font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onAddTranslation(pageKey, [])
              }}
            >
              + Add Translation
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-slate-600 rounded-md hover:bg-gray-50 font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onRenamePage(pageKey)
              }}
            >
              Edit Name
            </button>
            <button
              className="text-xs px-3 py-1.5 bg-white border border-red-100 text-red-600 rounded-md hover:bg-red-50 font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onDeletePage(pageKey)
              }}
            >
              Delete
            </button>
          </div>
          <div className="p-1 rounded-full hover:bg-slate-200 transition-colors">
            {isExpanded ? (
              <svg className="w-5 h-5 text-slate-400 transition-transform duration-200 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-6 space-y-6 border-t border-gray-100">
          <TranslationsTable
            pageKey={pageKey}
            path={[]}
            translations={page.translations}
            isParentArray={false}
            onRename={onRenameTranslation}
            onDelete={onDeleteTranslation}
            onEdit={onEditTranslation}
            onChangeOrder={onChangeOrder}
          />
          <SpacesList
            pageKey={pageKey}
            path={[]}
            container={page}
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
    </section>
  )
}

