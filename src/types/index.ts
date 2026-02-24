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
  budget_display?: string
  budget_min?: number | null
  budget_max?: number | null
  status: 'matching' | 'active' | 'completed' | 'expired'
  source?: string
  wa_job_id?: string
  timeline?: string
  skills_needed?: string[]
  contact?: { phone?: string; raw?: string; source?: string }
  created_at: string
  expires_at?: string
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
  users: { total: number; active_7d: number; active_30d: number; telegram: number; whatsapp: number; profile_completed: number }
  jobs: { scraped_today: number; processed: number; rejected_haiku: number; rejected_batch: number; notified: number; queue_backlog: number }
  requests: { total: number; active: number }
  matches: { total: number; connections: number }
  ai: { cost_today: number; cost_saved: number }
  messaging: { sent_today: number; failed_today: number }
  opportunities: { active: number }
  timestamp: string
}

export interface ActivityLog {
  id: string
  event_type: string
  description: string
  timestamp: string
  user_id?: string
  metadata?: Record<string, any>
}