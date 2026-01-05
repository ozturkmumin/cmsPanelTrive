'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useTranslation } from '@/contexts/TranslationContext'

interface AddSpaceModalProps {
  isOpen: boolean
  onClose: () => void
  pageKey: string
  path: string[]
  onSuccess: (message: string) => void
}

export default function AddSpaceModal({ isOpen, onClose, pageKey, path, onSuccess }: AddSpaceModalProps) {
  const { addSpace, isValidKey } = useTranslation()
  const [spaceKey, setSpaceKey] = useState('')
  const [isArray, setIsArray] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    if (!isValidKey(spaceKey)) {
      setError('Invalid space key (no spaces allowed)')
      return
    }
    try {
      addSpace(pageKey, path, spaceKey, isArray)
      onSuccess('Space added successfully!')
      setSpaceKey('')
      setIsArray(false)
      onClose()
    } catch (e: any) {
      setError(e.message || 'Failed to add space')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Add Space</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Space Key</label>
          <input
            value={spaceKey}
            onChange={(e) => setSpaceKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5"
            placeholder="e.g. header, footer"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isArray}
              onChange={(e) => setIsArray(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700">Is Array</span>
          </label>
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

