'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useTranslation } from '@/contexts/TranslationContext'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
}

export default function ImportModal({ isOpen, onClose, onSuccess }: ImportModalProps) {
  const { importTranslations, isValidKey, languages, addLanguage } = useTranslation()
  const [lang, setLang] = useState('')
  const [jsonStr, setJsonStr] = useState('')
  const [error, setError] = useState('')

  const handleImport = () => {
    setError('')
    if (!isValidKey(lang)) {
      setError('Invalid language code')
      return
    }
    if (!jsonStr.trim()) {
      setError('Please paste JSON content')
      return
    }

    try {
      const data = JSON.parse(jsonStr)
      if (!languages.includes(lang.toLowerCase())) {
        addLanguage(lang.toLowerCase())
      }
      importTranslations(lang.toLowerCase(), data)
      onSuccess('Import successful!')
      setLang('')
      setJsonStr('')
      onClose()
    } catch (e: any) {
      setError('Import Failed: ' + e.message)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Import JSON</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Target Language Code</label>
          <input
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5 mb-1"
            placeholder="e.g. en, tr"
          />
          <p className="text-xs text-slate-500">If the language doesn't exist, it will be added.</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">JSON Content</label>
          <textarea
            value={jsonStr}
            onChange={(e) => setJsonStr(e.target.value)}
            rows={8}
            className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5 font-mono text-xs"
            placeholder="Paste your JSON here..."
          />
        </div>
        {error && <div className="text-red-500 text-sm mt-2 mb-3">{error}</div>}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-sm"
          >
            Import
          </button>
        </div>
      </div>
    </Modal>
  )
}

