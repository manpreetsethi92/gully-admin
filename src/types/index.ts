export interface StatCard {
  label: string
  value: string | number
  trend?: number
  icon?: string
  color?: 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'pink' | 'cyan'
}

export interface WAGroupJob {
  id: string
  group_jid: string
  group_name: string
  sender_jid: string
  sender_phone?: string
  sender_name?: string
  title: string
  description: string
  project_type: string
  location: string
  budget?: string
  shoot_dates?: string
  contact: {
    name?: string
    phone?: string
    email?: string
    instagram?: string
    portfolio?: string
    source?: 'message' | 'sender'
  }
  roles_needed: Array<{
    role: string
    gender?: string
    age_range?: string
  }>
  skills_needed: string[]
  status: 'new' | 'matched' | 'expired'
  created_at: string
  matches_count: number
  urgency: 'high' | 'medium' | 'low'
}

export interface Request {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  location?: string
  budget?: string
  status: 'matching' | 'active' | 'completed' | 'expired'
  created_at: string
  matches_count: number
}

export interface User {
  id: string
  name: string
  phone: string
  location?: string
  skills?: string[]
  profile_completed: boolean
  verification_level: string
  created_at: string
  last_active?: string
}

export interface Match {
  id: string
  request_id: string
  user_id: string
  score: number
  reasons: string[]
  status: 'pending' | 'notified' | 'converted' | 'declined' | 'ghosted'
  created_at: string
}

export interface DashboardStats {
  total_users: number
  active_users_7d: number
  total_requests: number
  active_requests: number
  wa_jobs_today: number
  matches_created: number
  queue_backlog: number
  system_health: 'healthy' | 'degraded' | 'down'
}

export interface ActivityLog {
  id: string
  event_type: string
  description: string
  timestamp: string
  user_id?: string
}
