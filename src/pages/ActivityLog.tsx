import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import { Activity, Zap, Users, Target, RefreshCw } from 'lucide-react'
import { fetchActivityLog } from '../utils/api'
import { formatRelativeTime } from '../utils/format'

interface ActivityItem {
  id: string
  action: string
  user_id?: string
  details?: Record<string, any>
  timestamp: string
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchActivityLog(200)
      setActivities(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load activity log:', err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const getEventIcon = (action: string) => {
    const a = action || ''
    if (a.includes('job')) return <Zap size={16} className="text-yellow-400" />
    if (a.includes('match')) return <Target size={16} className="text-green-400" />
    if (a.includes('user') || a.includes('signup') || a.includes('join') || a.includes('onboard')) return <Users size={16} className="text-blue-400" />
    if (a.includes('request')) return <Target size={16} className="text-purple-400" />
    return <Activity size={16} className="text-gray-400" />
  }

  const formatDetails = (details?: Record<string, any>): string => {
    if (!details) return '—'
    const parts = Object.entries(details)
      .filter(([, v]) => v != null && v !== '')
      .slice(0, 3)
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v).slice(0, 40) : String(v).slice(0, 60)}`)
    return parts.join(' · ') || '—'
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayActivities = activities.filter(a => new Date(a.timestamp) >= todayStart)
  const stats = {
    today: todayActivities.length,
    requests: activities.filter(a => a.action?.includes('request')).length,
    matches: activities.filter(a => a.action?.includes('match')).length,
    users: activities.filter(a => a.action?.includes('user') || a.action?.includes('join') || a.action?.includes('onboard')).length,
  }

  const columns = [
    { key: 'action' as const, label: 'Event', render: (val: string) => (
      <div className="flex items-center gap-2">
        {getEventIcon(val)}
        <span className="text-sm font-medium capitalize">{(val || '').replace(/_/g, ' ')}</span>
      </div>
    )},
    { key: 'details' as const, label: 'Details', render: (val?: Record<string, any>) =>
      <span className="text-sm text-gray-300 truncate max-w-xs block">{formatDetails(val)}</span>
    },
    { key: 'user_id' as const, label: 'User', render: (val?: string) =>
      <span className="text-sm text-gray-400 font-mono">{val ? val.slice(0, 8) + '...' : 'system'}</span>
    },
    { key: 'timestamp' as const, label: 'Time', render: (val: string) =>
      <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span>
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-gray-400 text-sm mt-1">All platform events ({activities.length} total)</p>
        </div>
        <button onClick={load} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Today's Events</div>
          <div className="text-2xl font-bold">{stats.today}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Request Events</div>
          <div className="text-2xl font-bold">{stats.requests}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Match Events</div>
          <div className="text-2xl font-bold">{stats.matches}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">User Events</div>
          <div className="text-2xl font-bold">{stats.users}</div>
        </div>
      </div>

      {activities.length > 0 ? (
        <DataTable<ActivityItem>
          columns={columns}
          data={activities}
          loading={loading}
          rowKey="id"
        />
      ) : (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center text-gray-500">
          {loading ? 'Loading...' : 'No activity events recorded yet'}
        </div>
      )}
    </div>
  )
}
