import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import { Activity, Zap, Users, Target } from 'lucide-react'
import { ActivityLog } from '../types'
import { formatRelativeTime } from '../utils/format'

const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: '1', event_type: 'job_ingested', description: 'WA group job ingested from Bhawsheel group', timestamp: new Date(Date.now() - 5*60*1000).toISOString(), user_id: 'system' },
  { id: '2', event_type: 'match_created', description: 'AI match created: User #123 → Job #456', timestamp: new Date(Date.now() - 15*60*1000).toISOString(), user_id: 'system' },
  { id: '3', event_type: 'user_joined', description: 'New user signed up: @johndoe', timestamp: new Date(Date.now() - 30*60*1000).toISOString(), user_id: 'johndoe' },
  { id: '4', event_type: 'request_created', description: 'User created request: Need a DOP in Mumbai', timestamp: new Date(Date.now() - 60*60*1000).toISOString(), user_id: 'user456' },
  { id: '5', event_type: 'match_converted', description: 'Match converted to connection', timestamp: new Date(Date.now() - 2*60*60*1000).toISOString(), user_id: 'system' },
]

export default function ActivityLog() {
  const [activities, setActivities] = useState<ActivityLog[]>(MOCK_ACTIVITIES)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // TODO: Load activity logs from API
    setLoading(false)
  }, [])

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

  const columns = [
    { 
      key: 'event_type' as const, 
      label: 'Event', 
      render: (val: string) => (
        <div className="flex items-center gap-2">
          {getEventIcon(val)}
          <span className="text-sm font-medium capitalize">{val.replace(/_/g, ' ')}</span>
        </div>
      ),
      width: '150px'
    },
    { 
      key: 'description' as const, 
      label: 'Details', 
      render: (val: string) => <span className="text-sm text-gray-300">{val}</span> 
    },
    { 
      key: 'timestamp' as const, 
      label: 'Time', 
      render: (val: string) => <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span>,
      sortable: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <p className="text-gray-400 text-sm mt-1">View all platform events and activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Today's Events</div>
          <div className="text-2xl font-bold">24</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Jobs Ingested</div>
          <div className="text-2xl font-bold">8</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Matches Created</div>
          <div className="text-2xl font-bold">12</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">New Users</div>
          <div className="text-2xl font-bold">3</div>
        </div>
      </div>

      <DataTable<ActivityLog>
        columns={columns}
        data={activities}
        loading={loading}
        rowKey="id"
      />
    </div>
  )
}
