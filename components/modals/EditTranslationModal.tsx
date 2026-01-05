'use client'

import React, { useState, useEffect } from 'react'
import Modal from '../Modal'
import { useTranslation } from '@/contexts/TranslationContext'

interface EditTranslationModalProps {
  isOpen: boolean
  onClose: () => void
  pageKey: string
  path: string[]
  key: string
  onSuccess: (message: string) => void
}

export default function EditTranslationModal({ isOpen, onClose, pageKey, path, key: tkey, onSuccess }: EditTranslationModalProps) {
  const { getSpaceContainer, languages, renameTranslationKey, updateTranslationValue } = useTranslation()
  const [newKey, setNewKey] = useState(tkey)
  const [values, setValues] = useState<{ [lang: string]: any }>({})
  const [type, setType] = useState<'string' | 'number' | 'boolean' | 'null'>('string')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      const container = getSpaceContainer(pageKey, path)
      if (container && container.translations && container.translations[tkey]) {
        setNewKey(tkey)
        setValues(container.translations[tkey])
        
        // Determine type
        for (const lang of languages) {
          const val = container.translations[tkey][lang]
          if (val !== undefined) {
            if (typeof val === 'number') setType('number')
            else if (typeof val === 'boolean') setType('boolean')
            else if (val === null) setType('null')
            else setType('string')
            break
          }
        }
      }
    }
  }, [isOpen, pageKey, path, tkey, getSpaceContainer, languages])

  const handleSubmit = () => {
    setError('')
    try {
      // Rename key if changed
      if (newKey !== tkey) {
        renameTranslationKey(pageKey, path, tkey, newKey)
      }
      
      // Update values
      languages.forEach(lang => {
        let val: any = values[lang]
        if (type === 'number') {
          val = val === '' ? 0 : parseFloat(val)
        } else if (type === 'boolean') {
          val = val === 'true'
        } else if (type === 'null') {
          val = null
        }
        updateTranslationValue(pageKey, path, newKey, lang, val)
      })
      
      onSuccess('Translation updated successfully!')
      onClose()
    } catch (e: any) {
      setError(e.message || 'Failed to update translation')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Translation</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Key</label>
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="null">Null</option>
          </select>
        </div>
        <div className="mb-4 space-y-2">
          {languages.map(lang => (
            <div key={lang}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{lang}</label>
              {type === 'string' ? (
                <textarea
                  value={values[lang] || ''}
                  onChange={(e) => setValues({ ...values, [lang]: e.target.value })}
                  className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5"
                  rows={3}
                />
              ) : (
                <input
                  type={type === 'number' ? 'number' : 'text'}
                  value={type === 'boolean' ? (values[lang] === true ? 'true' : 'false') : (values[lang] ?? '')}
                  onChange={(e) => {
                    let val: any = e.target.value
                    if (type === 'number') val = e.target.value === '' ? '' : parseFloat(e.target.value)
                    else if (type === 'boolean') val = e.target.value === 'true'
                    setValues({ ...values, [lang]: val })
                  }}
                  className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5"
                />
              )}
            </div>
          ))}
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
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}

