'use client'

import { TranslationProvider } from '@/contexts/TranslationContext'
import TranslationManager from '@/components/TranslationManager'
import AuthGuard from '@/components/AuthGuard'

export default function Home() {
  return (
    <AuthGuard>
      <TranslationProvider>
        <div className="max-w-7xl mx-auto pb-20">
          <TranslationManager />
        </div>
      </TranslationProvider>
    </AuthGuard>
  )
}

