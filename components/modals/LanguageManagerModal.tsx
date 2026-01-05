'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useTranslation } from '@/contexts/TranslationContext'
import AddLanguageModal from './AddLanguageModal'

interface LanguageManagerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
}

export default function LanguageManagerModal({ isOpen, onClose, onSuccess }: LanguageManagerModalProps) {
  const { languages, deleteLanguage, renameLanguage } = useTranslation()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingLang, setEditingLang] = useState<string | null>(null)
  const [newCode, setNewCode] = useState('')

  const handleDelete = (code: string) => {
    if (confirm(`Are you sure you want to delete language "${code}"? This will remove all translations for this language.`)) {
      try {
        deleteLanguage(code)
        onSuccess('Language deleted successfully!')
      } catch (e: any) {
        onSuccess(e.message || 'Failed to delete language')
      }
    }
  }

  const handleRename = (oldCode: string) => {
    setEditingLang(oldCode)
    setNewCode(oldCode)
  }

  const saveRename = () => {
    if (!editingLang) return
    try {
      renameLanguage(editingLang, newCode)
      onSuccess('Language renamed successfully!')
      setEditingLang(null)
      setNewCode('')
    } catch (e: any) {
      onSuccess(e.message || 'Failed to rename language')
    }
  }

  if (!isOpen) return null

  return (
    <>
      <Modal isOpen={isOpen && !showAddModal} onClose={onClose}>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Manage Languages</h3>
          <div className="mb-6 max-h-60 overflow-y-auto">
            {languages.length === 0 ? (
              <p className="text-slate-500 text-sm">No languages added yet.</p>
            ) : (
              languages.map(l => (
                <div key={l} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                  {editingLang === l ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        className="flex-1 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white p-2 text-sm"
                      />
                      <button
                        onClick={saveRename}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingLang(null)}
                        className="px-3 py-1 text-slate-600 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-bold text-slate-700 uppercase">{l}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRename(l)}
                          className="text-indigo-500 hover:text-indigo-700 text-sm font-medium"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => handleDelete(l)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                  localStorage.clear()
                  window.location.reload()
                }
              }}
              className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors text-sm"
            >
              Reset / Clear All Data
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-sm"
              >
                + Add Language
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <AddLanguageModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={(msg) => {
          onSuccess(msg)
          setShowAddModal(false)
        }}
      />
    </>
  )
}

