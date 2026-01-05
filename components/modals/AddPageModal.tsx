'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useTranslation } from '@/contexts/TranslationContext'

interface AddPageModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
}

export default function AddPageModal({ isOpen, onClose, onSuccess }: AddPageModalProps) {
  const { addPage, isValidKey } = useTranslation()
  const [pageKey, setPageKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    if (!isValidKey(pageKey)) {
      setError('Invalid page key (no spaces allowed)')
      return
    }
    try {
      addPage(pageKey)
      onSuccess('Page added successfully!')
      setPageKey('')
      onClose()
    } catch (e: any) {
      setError(e.message || 'Failed to add page')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Add Page</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Page Key</label>
          <input
            value={pageKey}
            onChange={(e) => setPageKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5"
            placeholder="e.g. home, dashboard"
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

