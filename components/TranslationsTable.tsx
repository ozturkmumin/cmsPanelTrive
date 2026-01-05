'use client'

import React, { useMemo } from 'react'
import { useTranslation } from '@/contexts/TranslationContext'
import LastActivityBadge from './LastActivityBadge'

interface TranslationsTableProps {
  pageKey: string
  path: string[]
  translations: { [key: string]: { [lang: string]: any } }
  isParentArray: boolean
  onRename: (pageKey: string, path: string[], oldKey: string) => void
  onDelete: (pageKey: string, path: string[], key: string) => void
  onEdit: (pageKey: string, path: string[], key: string) => void
  onChangeOrder: (pageKey: string, path: string[], key: string, type: 'space' | 'translation') => void
}

export default function TranslationsTable({
  pageKey,
  path,
  translations,
  isParentArray,
  onRename,
  onDelete,
  onEdit,
  onChangeOrder,
}: TranslationsTableProps) {
  const { languages, searchQuery, updateTranslationValue } = useTranslation()

  const keys = useMemo(() => {
    const sorted = Object.keys(translations || {}).sort((a, b) => {
      if (isParentArray) {
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
    return sorted.filter(k => {
      if (k.toLowerCase().includes(query)) return true
      const vals = translations[k]
      for (const lang in vals) {
        const val = String(vals[lang] || '')
        if (val.toLowerCase().includes(query)) return true
      }
      return false
    })
  }, [translations, isParentArray, searchQuery])

  if (keys.length === 0) {
    if (searchQuery) return null
    return <div className="text-xs text-slate-400 italic py-2">No translations</div>
  }

  const getType = (key: string): string => {
    const vals = translations[key]
    for (const lang of languages) {
      const v = vals[lang]
      if (v !== undefined) {
        if (typeof v === 'number') return 'number'
        if (typeof v === 'boolean') return 'boolean'
        if (v === null) return 'null'
        return 'string'
      }
    }
    return 'string'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-slate-400 uppercase text-xs tracking-wider">
            {isParentArray && <th className="p-2 font-medium w-16">Order</th>}
            <th className="p-2 font-medium w-1/4">Key</th>
            {languages.map(l => (
              <th key={l} className="p-2 font-medium">{l}</th>
            ))}
            <th className="p-2 font-medium w-20 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {keys.map(tkey => {
            const num = parseInt(tkey)
            const order = (isParentArray && !isNaN(num)) ? num + 1 : '-'
            const type = getType(tkey)
            const keyMatch = searchQuery ? tkey.toLowerCase().includes(searchQuery.toLowerCase()) : false

            return (
              <tr key={tkey} className="hover:bg-slate-50/50 transition-colors group/row">
                {isParentArray && (
                  <td className="p-2 font-medium text-slate-500 align-top">
                    <div className="flex items-center gap-1">
                      <span>{order !== '-' ? order : ''}</span>
                      <button
                        className="text-slate-300 hover:text-indigo-600 opacity-0 group-hover/row:opacity-100 transition-opacity"
                        onClick={() => onChangeOrder(pageKey, path, tkey, 'translation')}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                )}
                <td className="p-2 font-medium text-slate-700 align-top">
                  <div>
                    <div className="flex items-center">
                      {tkey}
                      {type === 'number' && (
                        <span className="ml-2 text-[9px] uppercase font-bold text-green-600 bg-green-100 px-1 rounded">NUM</span>
                      )}
                      {type === 'boolean' && (
                        <span className="ml-2 text-[9px] uppercase font-bold text-blue-600 bg-blue-100 px-1 rounded">BOOL</span>
                      )}
                      {type === 'null' && (
                        <span className="ml-2 text-[9px] uppercase font-bold text-gray-600 bg-gray-100 px-1 rounded">NULL</span>
                      )}
                      {type === 'string' && (
                        <span className="ml-2 text-[9px] uppercase font-bold text-slate-400 bg-slate-100 px-1 rounded">STR</span>
                      )}
                      {keyMatch && (
                        <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">Match</span>
                      )}
                    </div>
                    <LastActivityBadge
                      entityType="translation"
                      entityId={`${pageKey}/${path.join('/')}/${tkey}`}
                      compact
                    />
                  </div>
                </td>
                {languages.map(lang => {
                  const val = translations[tkey][lang]
                  const valMatch = searchQuery ? String(val || '').toLowerCase().includes(searchQuery.toLowerCase()) : false
                  const valType = typeof val
                  const isNull = val === null

                  return (
                    <td key={lang} className={`p-2 align-top ${valMatch ? 'bg-yellow-50/50' : ''}`}>
                      {valType === 'string' ? (
                        <textarea
                          rows={1}
                          className="w-full bg-transparent border-transparent focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded px-2 py-1 text-slate-600 resize-none transition-all hover:bg-white hover:border-gray-200"
                          value={val || ''}
                          onChange={(e) => {
                            updateTranslationValue(pageKey, path, tkey, lang, e.target.value)
                            e.currentTarget.style.height = 'auto'
                            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
                          }}
                          onInput={(e) => {
                            const target = e.currentTarget
                            target.style.height = 'auto'
                            target.style.height = target.scrollHeight + 'px'
                          }}
                        />
                      ) : valType === 'boolean' ? (
                        <div className="px-2 py-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {String(val)}
                          </span>
                        </div>
                      ) : valType === 'number' ? (
                        <div className="px-2 py-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                            {String(val)}
                          </span>
                        </div>
                      ) : isNull ? (
                        <div className="px-2 py-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100 italic">
                            null
                          </span>
                        </div>
                      ) : null}
                    </td>
                  )
                })}
                <td className="p-2 text-right align-top">
                  <div className="flex justify-end gap-1">
                    <button
                      className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Edit Key & Values"
                      onClick={() => onEdit(pageKey, path, tkey)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete"
                      onClick={() => onDelete(pageKey, path, tkey)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

