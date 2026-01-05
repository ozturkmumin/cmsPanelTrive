'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useTranslation } from '@/contexts/TranslationContext'

interface AddTranslationModalProps {
  isOpen: boolean
  onClose: () => void
  pageKey: string
  path: string[]
  onSuccess: (message: string) => void
}

export default function AddTranslationModal({ isOpen, onClose, pageKey, path, onSuccess }: AddTranslationModalProps) {
  const { addTranslation, languages, isValidKey } = useTranslation()
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    if (!isValidKey(key)) {
      setError('Invalid key (no spaces allowed)')
      return
    }
    try {
      addTranslation(pageKey, path, key)
      onSuccess('Translation added successfully!')
      setKey('')
      onClose()
    } catch (e: any) {
      setError(e.message || 'Failed to add translation')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Add Translation</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Translation Key</label>
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5"
            placeholder="e.g. welcome_message"
          />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-sm"
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  )
}

