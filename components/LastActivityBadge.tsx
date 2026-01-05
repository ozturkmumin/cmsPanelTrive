'use client'

import React, { useEffect, useState } from 'react'
import { getEntityActivities, ActivityLog } from '@/lib/activityLog'

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
    try {
      const activities = await getEntityActivities(entityType, entityId, 1)
      if (activities.length > 0) {
        setActivity(activities[0])
      }
    } catch (error) {
      console.error('Error loading activity:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !activity) {
    return null
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

  return (
    <div className="text-xs text-slate-400 flex items-center gap-1">
      <span className="text-slate-500">by</span>
      <span className="font-medium text-slate-600">{activity.userName || activity.userEmail.split('@')[0]}</span>
      <span className="text-slate-400">•</span>
      <span>{formatTime(activity.timestamp)}</span>
    </div>
  )
}

