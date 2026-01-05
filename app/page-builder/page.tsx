'use client'

import { Suspense } from 'react'
import PageBuilder from '@/components/pageBuilder/PageBuilder'

function PageBuilderContent() {
  return <PageBuilder />
}

export default function PageBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading page builder...</p>
        </div>
      </div>
    }>
      <PageBuilderContent />
    </Suspense>
  )
}

