import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import { Activity, Zap, Users, Target, RefreshCw } from 'lucide-react'
import { fetchActivityLog } from '../utils/api'
import { formatRelativeTime } from '../utils/format'

interface ActivityItem {
  id: string
  event_type: string
  description: string
  timestamp: string
  user_id?: string
  metadata?: Record<string, any>
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchActivityLog(100)
      setActivities(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load activity log:', err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const getEventIcon = (eventType: string) => {
    switch(eventType) {
      case 'job_ingested': return <Zap size={16} className="text-yellow-400" />
      case 'match_created': return <Target size={16} className="text-green-400" />
      case 'user_joined': return <Users size={16} className="text-blue-400" />
      case 'request_created': return <Target size={16} className="text-purple-400" />
      case 'match_converted': return <Activity size={16} className="text-accent" />
      default: return <Activity size={16} className="text-gray-400" />
    }
  }

  // Compute stats from real data
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayActivities = activities.filter(a => new Date(a.timestamp) >= todayStart)
  const statsComputed = {
    today: todayActivities.length,
    jobs: todayActivities.filter(a => a.event_type === 'job_ingested').length,
    matches: todayActivities.filter(a => a.event_type === 'match_created').length,
    users: todayActivities.filter(a => a.event_type === 'user_joined').length,
  }

  const columns = [
    { key: 'event_type' as const, label: 'Event', render: (val: string) => (
      <div className="flex items-center gap-2">
        {getEventIcon(val)}
        <span className="text-sm font-medium capitalize">{val.replace(/_/g, ' ')}</span>
      </div>
    ), width: '180px' },
    { key: 'description' as const, label: 'Details', render: (val: string) => <span className="text-sm text-gray-300">{val}</span> },
    { key: 'user_id' as const, label: 'User', render: (val?: string) => <span className="text-sm text-gray-400 font-mono">{val ? val.slice(0, 16) : 'system'}</span> },
    { key: 'timestamp' as const, label: 'Time', render: (val: string) => <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span>, sortable: true },
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-gray-400 text-sm mt-1">All platform events and activities</p>
        </div>
        <button onClick={load} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Refresh">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Today's Events</div>
          <div className="text-2xl font-bold">{statsComputed.today}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Jobs Ingested</div>
          <div className="text-2xl font-bold">{statsComputed.jobs}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Matches Created</div>
          <div className="text-2xl font-bold">{statsComputed.matches}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">New Users</div>
          <div className="text-2xl font-bold">{statsComputed.users}</div>
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