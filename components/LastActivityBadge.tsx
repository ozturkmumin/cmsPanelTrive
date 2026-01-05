'use client'

import React, { useEffect, useState } from 'react'
import { getEntityActivities } from '@/lib/activityLog'
import { ActivityLog } from '@/types/activity'

interface LastActivityBadgeProps {
  entityType: ActivityLog['entityType']
  entityId: string
  compact?: boolean
}

export default function LastActivityBadge({ entityType, entityId, compact = false }: LastActivityBadgeProps) {
  const [activity, setActivity] = useState<ActivityLog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivity()
  }, [entityType, entityId])

  const loadActivity = async () => {
    setLoading(true)
    try {
      console.log('Loading activity for:', { entityType, entityId })
      
      // For page entity type, also check translation activities that start with pageKey
      let activities = await getEntityActivities(entityType, entityId, 10)
      
      // If entityType is 'page', also get translation activities for this page
      if (entityType === 'page') {
        const { getRecentActivities } = await import('@/lib/activityLog')
        const translationActivities = await getRecentActivities(10, 'translation')
        // Filter translation activities that belong to this page
        const pageTranslationActivities = translationActivities.filter(
          (act: ActivityLog) => act.entityId?.startsWith(entityId + '/')
        )
        // Combine and sort by timestamp
        activities = [...activities, ...pageTranslationActivities]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      }
      
      console.log('Found activities:', activities.length, activities)
      if (activities.length > 0) {
        setActivity(activities[0])
      } else {
        console.log('No activities found for entity:', entityId)
      }
    } catch (error) {
      console.error('Error loading activity:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
        <span>Loading...</span>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>No activity yet</span>
      </div>
    )
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  if (compact) {
    return (
      <span className="text-xs text-slate-400" title={`${activity.userName || activity.userEmail} - ${formatTime(activity.timestamp)}`}>
        {formatTime(activity.timestamp)}
      </span>
    )
  }

  const formatFullTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex items-center gap-2 text-xs flex-wrap">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 shadow-sm">
        <span className="text-indigo-600 text-sm">👤</span>
        <span className="font-semibold text-indigo-700">{activity.userEmail || activity.userName}</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
        <span className="text-slate-500 text-sm">🕒</span>
        <span className="text-slate-600 font-medium">{formatTime(activity.timestamp)}</span>
      </div>
      {activity.action && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-[11px] font-semibold shadow-sm">
          {activity.action === 'create' && '➕ Oluşturuldu'}
          {activity.action === 'update' && '✏️ Güncellendi'}
          {activity.action === 'delete' && '🗑️ Silindi'}
          {activity.action === 'import' && '📥 İçe Aktarıldı'}
          {activity.action === 'export' && '📤 Dışa Aktarıldı'}
        </div>
      )}
      {activity.entityName && activity.entityType !== 'page' && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-[10px] font-medium">
          "{activity.entityName}"
        </div>
      )}
    </div>
  )
}

