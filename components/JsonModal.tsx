'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from '@/contexts/TranslationContext'

interface JsonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function JsonModal({ isOpen, onClose }: JsonModalProps) {
  const { languages, getTranslationsByLang } = useTranslation()
  const [selectedLang, setSelectedLang] = useState('')
  const [jsonContent, setJsonContent] = useState('')

  useEffect(() => {
    if (isOpen && languages.length > 0) {
      setSelectedLang(languages[0])
    }
  }, [isOpen, languages])

  useEffect(() => {
    if (selectedLang) {
      const data = getTranslationsByLang(selectedLang)
      setJsonContent(JSON.stringify(data[selectedLang], null, 2))
    }
  }, [selectedLang, getTranslationsByLang])

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonContent).then(() => {
      // Toast would be shown here
    }).catch(() => {
      // Error toast
    })
  }

  const handleDownload = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'translations.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl transform transition-all border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Export JSON</h2>
          <div className="flex gap-3">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-sm py-2 px-3"
            >
              {languages.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium rounded-lg transition-colors"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium rounded-lg shadow-md transition-colors"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <pre className="bg-slate-900 text-slate-50 p-6 rounded-xl h-[500px] overflow-auto font-mono text-sm shadow-inner">
          <code>{jsonContent}</code>
        </pre>
      </div>
    </div>
  )
}

