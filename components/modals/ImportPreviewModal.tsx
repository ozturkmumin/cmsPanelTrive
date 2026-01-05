'use client'

import React from 'react'
import Modal from '../Modal'
import { useTranslation } from '@/contexts/TranslationContext'

interface ImportPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  diff: { updates: any[], additions: any[] }
  lang: string
  data: any
  onSuccess: (message: string) => void
}

export default function ImportPreviewModal({ isOpen, onClose, diff, lang, data, onSuccess }: ImportPreviewModalProps) {
  const { importTranslations } = useTranslation()

  const handleConfirm = () => {
    importTranslations(lang, data)
    onSuccess('Import successful!')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Import Preview</h3>
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">
            Updates: {diff.updates.length}, Additions: {diff.additions.length}
          </p>
          <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-xs h-60 overflow-auto">
            {JSON.stringify({ updates: diff.updates, additions: diff.additions }, null, 2)}
          </pre>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-sm"
          >
            Confirm Import
          </button>
        </div>
      </div>
    </Modal>
  )
}

