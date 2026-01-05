'use client'

import React from 'react'
import { Page } from '@/types/pageBuilder'
import BlockRenderer from './BlockRenderer'

interface PagePreviewProps {
  page: Page
  onClose: () => void
}

export default function PagePreview({ page, onClose }: PagePreviewProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Preview Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{page.name}</h1>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Exit Preview
        </button>
      </div>

      {/* Page Content */}
      <div>
        {page.blocks
          .sort((a, b) => a.order - b.order)
          .map(block => (
            <div key={block.id} style={block.styles}>
              <BlockRenderer block={block} />
            </div>
          ))}
      </div>
    </div>
  )
}

