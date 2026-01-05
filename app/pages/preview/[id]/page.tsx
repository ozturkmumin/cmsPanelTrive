'use client'

import React, { useEffect, useState } from 'react'
import { getPage } from '@/lib/pages'
import { Page } from '@/types/pageBuilder'
import { useParams } from 'next/navigation'
import BlockRenderer from '@/components/pageBuilder/BlockRenderer'

export default function PagePreview() {
  const params = useParams()
  const pageId = params.id as string
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPage()
  }, [pageId])

  const loadPage = async () => {
    try {
      const pageData = await getPage(pageId)
      setPage(pageData)
    } catch (error) {
      console.error('Error loading page:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading page...</p>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Page not found</p>
          <a href="/pages" className="text-indigo-600 hover:underline">
            Back to Pages
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold">{page.name}</h1>
          <p className="text-sm text-gray-500">/{page.slug}</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/pages"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ← Back to Pages
          </a>
          <a
            href={`/page-builder?page=${page.id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Edit
          </a>
        </div>
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

