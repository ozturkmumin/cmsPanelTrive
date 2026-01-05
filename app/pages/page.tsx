'use client'

import React, { useEffect, useState } from 'react'
import { getPages, deletePage } from '@/lib/pages'
import { Page } from '@/types/pageBuilder'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PagesList() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const allPages = await getPages()
      setPages(allPages)
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pageId: string, pageName: string) => {
    if (confirm(`Are you sure you want to delete "${pageName}"?`)) {
      try {
        await deletePage(pageId)
        await loadPages()
      } catch (error: any) {
        alert('Failed to delete page: ' + error.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading pages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Pages</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your created pages</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ← Back
            </Link>
            <Link
              href="/page-builder"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              + Create New Page
            </Link>
          </div>
        </div>

        {/* Pages Grid */}
        {pages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-slate-500 mb-4">No pages created yet.</p>
            <Link
              href="/page-builder"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Your First Page
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map(page => (
              <div
                key={page.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{page.name}</h3>
                      <p className="text-sm text-slate-500">/{page.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPage(page)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Preview"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleDelete(page.id, page.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span>📦 {page.blocks?.length || 0} blocks</span>
                      {page.updatedAt && (
                        <span>• Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/page-builder?page=${page.id}`}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/pages/preview/${page.id}`}
                      target="_blank"
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedPage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPage(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedPage.name}</h2>
              <button
                onClick={() => setSelectedPage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <PagePreviewContent page={selectedPage} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Preview component
function PagePreviewContent({ page }: { page: Page }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Name:</span>
          <p className="font-medium">{page.name}</p>
        </div>
        <div>
          <span className="text-gray-500">Slug:</span>
          <p className="font-medium">/{page.slug}</p>
        </div>
        <div>
          <span className="text-gray-500">Blocks:</span>
          <p className="font-medium">{page.blocks?.length || 0}</p>
        </div>
        {page.updatedAt && (
          <div>
            <span className="text-gray-500">Last Updated:</span>
            <p className="font-medium">{new Date(page.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-3">Blocks:</h3>
        <div className="space-y-2">
          {page.blocks
            ?.sort((a, b) => a.order - b.order)
            .map((block, idx) => (
              <div key={block.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{idx + 1}.</span>
                  <span className="text-sm font-semibold capitalize">{block.type}</span>
                  {block.styles?.backgroundColor && (
                    <span
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: block.styles.backgroundColor }}
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href={`/page-builder?page=${page.id}`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Edit Page
        </Link>
        <button
          onClick={async () => {
            const { downloadPageAsZip } = await import('@/lib/downloadPage')
            await downloadPageAsZip(page)
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Download as ZIP
        </button>
      </div>
    </div>
  )
}

