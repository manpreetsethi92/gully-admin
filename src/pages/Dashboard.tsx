import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import {
  Users, Target, Zap, TrendingUp, Activity, Link as LinkIcon,
  Clock, AlertCircle, MessageSquare, DollarSign
} from 'lucide-react'
import { fetchDashboardStats } from '../utils/api'

interface OverviewData {
  users: { total: number; active_7d: number; active_30d: number; telegram: number; whatsapp: number; profile_completed: number }
  jobs: { scraped_today: number; processed: number; rejected_haiku: number; rejected_batch: number; notified: number; queue_backlog: number }
  requests: { total: number; active: number }
  matches: { total: number; connections: number }
  ai: { cost_today: number; cost_saved: number }
  messaging: { sent_today: number; failed_today: number }
  opportunities: { active: number }
  timestamp: string
}

export default function Dashboard() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchDashboardStats()
        setData(res)
      } catch (err: any) {        setError(err.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading dashboard...</div>
  if (error || !data) return (
    <div className="text-center py-8">
      <p className="text-red-400 mb-4">{error || 'Failed to load dashboard'}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-accent rounded-lg text-white">Retry</button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Platform overview as of {new Date(data.timestamp).toLocaleTimeString()}</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={data.users.total} icon={<Users size={20} />} index={0} />
        <StatCard label="Active (7d)" value={data.users.active_7d} icon={<Activity size={20} />} index={1} />
        <StatCard label="WhatsApp Users" value={data.users.whatsapp} icon={<MessageSquare size={20} />} index={2} />
        <StatCard label="Profiles Completed" value={data.users.profile_completed} icon={<Users size={20} />} index={3} />
      </div>
      {/* Jobs & Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Jobs Processed" value={data.jobs.processed} icon={<Zap size={20} />} index={4} />
        <StatCard label="Active Opportunities" value={data.opportunities.active} icon={<Target size={20} />} index={5} />
        <StatCard label="Total Requests" value={data.requests.total} icon={<Clock size={20} />} index={6} />
        <StatCard label="Queue Backlog" value={data.jobs.queue_backlog} icon={<AlertCircle size={20} />} trend={data.jobs.queue_backlog > 50 ? 25 : -10} index={7} />
      </div>

      {/* Matches & Messaging */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Matches" value={data.matches.total} icon={<LinkIcon size={20} />} index={0} />
        <StatCard label="Connections" value={data.matches.connections} icon={<TrendingUp size={20} />} index={1} />
        <StatCard label="Messages Sent Today" value={data.messaging.sent_today} icon={<MessageSquare size={20} />} index={2} />
        <StatCard label="AI Cost Today" value={`$${data.ai.cost_today.toFixed(2)}`} icon={<DollarSign size={20} />} index={3} />
      </div>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/wa-jobs" className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group block">
              <span>View WA Group Jobs</span>
              <span className="opacity-0 group-hover:opacity-100">→</span>
            </Link>
            <Link to="/jobs" className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group block">
              <span>Job Pipeline</span>
              <span className="opacity-0 group-hover:opacity-100">→</span>
            </Link>
            <Link to="/activity" className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group block">
              <span>Activity Log</span>
              <span className="opacity-0 group-hover:opacity-100">→</span>
            </Link>
          </div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API Status</span>
              <span className="text-green-400">● Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Jobs Scraped Today</span>
              <span className="font-semibold">{data.jobs.scraped_today}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Rejected (Haiku)</span>
              <span className="text-yellow-400">{data.jobs.rejected_haiku}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Rejected (Batch)</span>
              <span className="text-yellow-400">{data.jobs.rejected_batch}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Messages Failed</span>
              <span className={data.messaging.failed_today > 0 ? 'text-red-400' : 'text-green-400'}>{data.messaging.failed_today}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}