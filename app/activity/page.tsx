'use client'

import React, { useEffect, useState } from 'react'
import { getRecentActivities } from '@/lib/activityLog'
import { ActivityLog } from '@/types/activity'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<{
    entityType?: ActivityLog['entityType']
    action?: ActivityLog['action']
  }>({})

  useEffect(() => {
    loadActivities()
  }, [filter])

  const loadActivities = async () => {
    setLoading(true)
    try {
      const allActivities = await getRecentActivities(100)
      let filtered = allActivities

      if (filter.entityType) {
        filtered = filtered.filter(a => a.entityType === filter.entityType)
      }
      if (filter.action) {
        filtered = filtered.filter(a => a.action === filter.action)
      }

      setActivities(filtered)
    } catch (error) {
      console.error('Error loading activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: ActivityLog['action']) => {
    switch (action) {
      case 'create': return '➕'
      case 'update': return '✏️'
      case 'delete': return '🗑️'
      case 'import': return '📥'
      case 'export': return '📤'
      case 'login': return '🔐'
      case 'logout': return '🚪'
      default: return '📝'
    }
  }

  const getEntityIcon = (entityType: ActivityLog['entityType']) => {
    switch (entityType) {
      case 'translation': return '🌐'
      case 'page': return '📄'
      case 'language': return '🗣️'
      case 'space': return '📁'
      case 'user': return '👤'
      default: return '📦'
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading activity log...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Activity Log</h1>
            <p className="text-slate-500 text-sm mt-1">Track all changes and activities</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Entity Type</label>
              <select
                value={filter.entityType || ''}
                onChange={(e) => setFilter({ ...filter, entityType: e.target.value as ActivityLog['entityType'] || undefined })}
                className="border-gray-300 rounded-lg p-2 text-sm"
              >
                <option value="">All Types</option>
                <option value="translation">Translation</option>
                <option value="page">Page</option>
                <option value="language">Language</option>
                <option value="space">Space</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Action</label>
              <select
                value={filter.action || ''}
                onChange={(e) => setFilter({ ...filter, action: e.target.value as ActivityLog['action'] || undefined })}
                className="border-gray-300 rounded-lg p-2 text-sm"
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
              </select>
            </div>
            {(filter.entityType || filter.action) && (
              <button
                onClick={() => setFilter({})}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm mt-6"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Activities List */}
        {activities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-slate-500">No activities found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {getActionIcon(activity.action)} {getEntityIcon(activity.entityType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{activity.userName || activity.userEmail}</span>
                        <span className="text-slate-500 text-sm">
                          {activity.action}ed {activity.entityType}
                        </span>
                        {activity.entityName && (
                          <span className="text-indigo-600 font-medium">"{activity.entityName}"</span>
                        )}
                      </div>
                      {activity.details && (
                        <p className="text-sm text-slate-600 mb-2">{activity.details}</p>
                      )}
                      {activity.changes && activity.changes.length > 0 && (
                        <div className="text-xs text-slate-500 space-y-1 mb-2">
                          {activity.changes.map((change, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="font-medium">{change.field}:</span>
                              <span className="text-red-600 line-through">{String(change.oldValue).substring(0, 50)}</span>
                              <span>→</span>
                              <span className="text-green-600">{String(change.newValue).substring(0, 50)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>{formatTime(activity.timestamp)}</span>
                        {activity.entityId && (
                          <span>ID: {activity.entityId.substring(0, 8)}...</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

