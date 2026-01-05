'use client'

import React from 'react'
import { useTranslation } from '@/contexts/TranslationContext'
import Link from 'next/link'

export default function Dashboard() {
  const { translations, languages } = useTranslation()

  const stats = React.useMemo(() => {
    let totalPages = 0
    let totalSpaces = 0
    let totalTranslations = 0
    let totalKeys = 0

    const countRecursive = (container: any) => {
      if (container.translations) {
        totalKeys += Object.keys(container.translations).length
        Object.values(container.translations).forEach((trans: any) => {
          if (trans && typeof trans === 'object') {
            totalTranslations += Object.keys(trans).length
          }
        })
      }
      if (container.spaces) {
        totalSpaces += Object.keys(container.spaces).length
        Object.values(container.spaces).forEach((space: any) => {
          countRecursive(space)
        })
      }
    }

    totalPages = Object.keys(translations).length
    Object.values(translations).forEach((page: any) => {
      countRecursive(page)
    })

    return {
      pages: totalPages,
      spaces: totalSpaces,
      translations: totalTranslations,
      keys: totalKeys,
      languages: languages.length,
    }
  }, [translations, languages])

  const statCards = [
    {
      title: 'Pages',
      value: stats.pages,
      icon: '📄',
      color: 'from-blue-500 to-cyan-500',
      link: '/pages',
    },
    {
      title: 'Languages',
      value: stats.languages,
      icon: '🌐',
      color: 'from-purple-500 to-pink-500',
      link: '/',
    },
    {
      title: 'Translation Keys',
      value: stats.keys,
      icon: '🔑',
      color: 'from-green-500 to-emerald-500',
      link: '/',
    },
    {
      title: 'Total Translations',
      value: stats.translations,
      icon: '📝',
      color: 'from-orange-500 to-red-500',
      link: '/',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, idx) => (
        <Link
          key={idx}
          href={stat.link}
          className="group relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`} />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-2xl shadow-md`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-slate-500 font-medium">{stat.title}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

