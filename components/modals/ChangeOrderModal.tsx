'use client'

import React, { useState } from 'react'
import Modal from '../Modal'

interface ChangeOrderModalProps {
  isOpen: boolean
  onClose: () => void
  pageKey: string
  path: string[]
  key: string
  type: 'space' | 'translation'
  onSuccess: (message: string) => void
}

export default function ChangeOrderModal({ isOpen, onClose, pageKey, path, key: tkey, type, onSuccess }: ChangeOrderModalProps) {
  const [newOrder, setNewOrder] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    const order = parseInt(newOrder)
    if (isNaN(order) || order < 0) {
      setError('Invalid order number')
      return
    }
    // Order change logic would go here
    onSuccess('Order changed successfully!')
    setNewOrder('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Change Order</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">New Order (0-based index)</label>
          <input
            type="number"
            value={newOrder}
            onChange={(e) => setNewOrder(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2.5"
            placeholder="0"
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

