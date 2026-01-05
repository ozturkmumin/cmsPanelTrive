'use client'

import React from 'react'
import { getCurrentUser, signOutUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onImportClick: () => void
  onGetJsonClick: () => void
  onLanguagesClick: () => void
  onAddPageClick: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function Header({
  onImportClick,
  onGetJsonClick,
  onLanguagesClick,
  onAddPageClick,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const router = useRouter()
  const user = getCurrentUser()

  const handleSignOut = async () => {
    try {
      await signOutUser()
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4 z-30">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Translation Manager</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your localization keys efficiently</p>
      </div>
      <div className="flex gap-3 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search pages, spaces, keys..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64 transition-all"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={onImportClick}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 font-medium rounded-lg transition-colors shadow-sm"
        >
          <span>Import JSON</span>
        </button>
        <button
          onClick={onGetJsonClick}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 font-medium rounded-lg transition-colors shadow-sm"
        >
          <span>Get JSON</span>
        </button>
        <button
          onClick={onLanguagesClick}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 font-medium rounded-lg transition-colors shadow-sm"
        >
          <span>Languages</span>
        </button>
        <button
          onClick={onAddPageClick}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <span>+ Add Page</span>
        </button>
        <a
          href="/pages"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 font-medium rounded-lg transition-colors shadow-sm"
        >
          <span>My Pages</span>
        </a>
        <a
          href="/page-builder"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <span>Page Builder</span>
        </a>
        {user && (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
            <span className="text-sm text-slate-600">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
