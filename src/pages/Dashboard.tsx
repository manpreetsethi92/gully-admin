import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import {
  Users, Target, Zap, TrendingUp, Activity, Link as LinkIcon,
  Clock, AlertCircle
} from 'lucide-react'
import { fetchDashboardStats } from '../utils/api'
import { DashboardStats } from '../types'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading dashboard...</div>
  }

  if (!stats) {
    return <div className="text-center py-8">Failed to load dashboard data</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here's your platform overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats.total_users}
          icon={<Users size={20} />}
          index={0}
        />
        <StatCard
          label="Active Users (7d)"
          value={stats.active_users_7d}
          icon={<Activity size={20} />}
          index={1}
        />
        <StatCard
          label="WA Jobs Today"
          value={stats.wa_jobs_today}
          icon={<Zap size={20} />}
          index={2}
        />
        <StatCard
          label="Matches Created"
          value={stats.matches_created}
          icon={<LinkIcon size={20} />}
          index={3}
        />
        <StatCard
          label="Total Requests"
          value={stats.total_requests}
          icon={<Target size={20} />}
          index={4}
        />
        <StatCard
          label="Active Requests"
          value={stats.active_requests}
          icon={<Clock size={20} />}
          index={5}
        />
        <StatCard
          label="Queue Backlog"
          value={stats.queue_backlog}
          icon={<AlertCircle size={20} />}
          trend={stats.queue_backlog > 100 ? 50 : -10}
          index={6}
        />
        <StatCard
          label="System Health"
          value={stats.system_health === 'healthy' ? '✓' : '⚠'}
          icon={<TrendingUp size={20} />}
          index={7}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group">
              <span>View WA Group Jobs</span>
              <span className="opacity-0 group-hover:opacity-100">→</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group">
              <span>Process Job Queue</span>
              <span className="opacity-0 group-hover:opacity-100">→</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group">
              <span>View Failed Matches</span>
              <span className="opacity-0 group-hover:opacity-100">→</span>
            </button>
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
              <span className="text-gray-400">Database</span>
              <span className="text-green-400">● Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-gray-500">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
