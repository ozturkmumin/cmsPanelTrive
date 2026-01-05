export interface ActivityLog {
  id?: string
  userId: string
  userEmail: string
  userName?: string
  action: 'create' | 'update' | 'delete' | 'import' | 'export' | 'login' | 'logout'
  entityType: 'translation' | 'page' | 'language' | 'space' | 'user'
  entityId?: string
  entityName?: string
  details?: string
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

