'use client'

import React, { useState, useEffect } from 'react'
import { Page } from '@/types/pageBuilder'
import { useRouter } from 'next/navigation'
import { savePage } from '@/lib/pages'
import { downloadPageAsZip } from '@/lib/downloadPage'
import { downloadPageAsHtml } from '@/lib/downloadHtml'

interface PageToolbarProps {
  page: Page
  onPageUpdate: (page: Page) => void
  onPreview: () => void
}

export default function PageToolbar({ page, onPageUpdate, onPreview }: PageToolbarProps) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [pageName, setPageName] = useState(page.name)
  const [pageSlug, setPageSlug] = useState(page.slug)
  const router = useRouter()

  // Update local state when page changes
  useEffect(() => {
    setPageName(page.name)
    setPageSlug(page.slug)
  }, [page.name, page.slug])

  const handleSave = async () => {
    try {
      const updatedPage: Page = {
        ...page,
        name: pageName,
        slug: pageSlug,
        blocks: page.blocks || [], // Ensure blocks array exists
        updatedAt: new Date().toISOString(),
      }
      
      console.log('Saving page:', updatedPage)
      const pageId = await savePage(updatedPage)
      const savedPage = { ...updatedPage, id: pageId }
      onPageUpdate(savedPage)
      setShowSaveModal(false)
      alert('Page saved successfully!')
      
      // Reload page if we're editing an existing page
      if (pageId && pageId !== 'new-page') {
        window.location.href = `/page-builder?page=${pageId}`
      }
    } catch (error: any) {
      console.error('Save error:', error)
      alert('Failed to save page: ' + error.message)
    }
  }

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold">Page Builder</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowSaveModal(true)}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Save Page
        </button>
        <button
          onClick={onPreview}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Preview
        </button>
        <button
          onClick={async () => {
            try {
              await downloadPageAsZip(page)
            } catch (error: any) {
              alert('Download failed: ' + error.message)
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          title="Download as Next.js project"
        >
          📦 Download ZIP
        </button>
        <button
          onClick={() => {
            try {
              downloadPageAsHtml(page)
            } catch (error: any) {
              alert('Download failed: ' + error.message)
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          title="Download as HTML file"
        >
          🌐 Download HTML
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Save Page</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Page Name</label>
                <input
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  className="w-full border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Page Slug</label>
                <input
                  type="text"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  className="w-full border-gray-300 rounded-lg p-2"
                  placeholder="page-slug"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

