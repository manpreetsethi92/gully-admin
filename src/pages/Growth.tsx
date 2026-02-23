import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { TrendingUp, Users, Target } from 'lucide-react'
import { fetchGrowthMetrics } from '../utils/api'

export default function Growth() {
  const [stats, setStats] = useState({
    daily_active: 0,
    weekly_active: 0,
    monthly_active: 0,
    signup_trend: 0,
    retention_rate: 0,
  })

  useEffect(() => {
    loadGrowthMetrics()
  }, [])

  const loadGrowthMetrics = async () => {
    try {
      const data = await fetchGrowthMetrics()
      setStats(data)
    } catch (error) {
      console.error('Failed to load growth metrics:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Growth Metrics</h1>
        <p className="text-gray-400 text-sm mt-1">Track platform growth and user engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="Daily Active" value={stats.daily_active} icon={<TrendingUp size={20} />} index={0} />
        <StatCard label="Weekly Active" value={stats.weekly_active} icon={<Users size={20} />} index={1} />
        <StatCard label="Monthly Active" value={stats.monthly_active} icon={<Target size={20} />} index={2} />
        <StatCard label="Signup Trend" value={`+${stats.signup_trend}%`} trend={stats.signup_trend} index={3} />
        <StatCard label="Retention" value={`${stats.retention_rate}%`} index={4} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">User Funnel</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Signups</span>
                <span className="font-semibold">100%</span>
              </div>
              <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Profile Complete</span>
                <span className="font-semibold">75%</span>
              </div>
              <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Made Connection</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Top Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Avg. Match Time</span>
              <span className="font-semibold">2.4h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Match Success Rate</span>
              <span className="font-semibold text-green-400">68%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Requests/Day</span>
              <span className="font-semibold">142</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
