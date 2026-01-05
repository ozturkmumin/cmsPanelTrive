'use client'

import React, { useEffect, useState } from 'react'
import { onAuthChange, getCurrentUser } from '@/lib/auth'
import { User } from 'firebase/auth'
import LoginModal from './LoginModal'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser)
      setLoading(false)
      if (currentUser) {
        router.refresh()
      }
    })

    // Check initial auth state
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginModal isOpen={true} onClose={() => {}} />
  }

  return <>{children}</>
}

