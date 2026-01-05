'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useTranslation } from '@/contexts/TranslationContext'

interface RenameSpaceModalProps {
  isOpen: boolean
  onClose: () => void
  pageKey: string
  path: string[]
  oldKey: string
  onSuccess: (message: string) => void
}

export default function RenameSpaceModal({ isOpen, onClose, pageKey, path, oldKey, onSuccess }: RenameSpaceModalProps) {
  const { renameSpace, isValidKey } = useTranslation()
  const [newKey, setNewKey] = useState(oldKey)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    if (!isValidKey(newKey)) {
      setError('Invalid space key (no spaces allowed)')
      return
    }
    try {
      renameSpace(pageKey, path, oldKey, newKey)
      onSuccess('Space renamed successfully!')
      onClose()
    } catch (e: any) {
      setError(e.message || 'Failed to rename space')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Rename Space</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">New Space Key</label>
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5"
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
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}

