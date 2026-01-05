'use client'

import React from 'react'
import { blockTemplates } from '@/lib/blockTemplates'

interface BlockLibraryProps {
  onAddBlock: (type: string, template: any) => void
}

export default function BlockLibrary({ onAddBlock }: BlockLibraryProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Block Library</h2>
      <div className="space-y-2">
        {blockTemplates.map(template => (
          <button
            key={template.type}
            onClick={() => onAddBlock(template.type, template)}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{template.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600">
                  {template.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {template.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

