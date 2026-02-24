import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { TrendingUp, Users, Target, LinkIcon } from 'lucide-react'
import { fetchGrowthDaily, fetchFunnel } from '../utils/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface DailyPoint { date: string; users: number; requests: number; connections: number }
interface FunnelStage { stage: string; count: number; percentage: number }
interface FunnelData {
  funnel: FunnelStage[]
  totals: { users: number; requests: number; matches: number; connections: number }
}

export default function Growth() {
  const [daily, setDaily] = useState<DailyPoint[]>([])
  const [funnel, setFunnel] = useState<FunnelData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [growthRes, funnelRes] = await Promise.all([fetchGrowthDaily(), fetchFunnel()])
        setDaily(growthRes.daily || [])
        setFunnel(funnelRes)
      } catch (err) {
        console.error('Failed to load growth data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading growth data...</div>

  const totals = funnel?.totals || { users: 0, requests: 0, matches: 0, connections: 0 }
  const funnelStages = funnel?.funnel || []

  // Format dates for chart
  const chartData = daily.map(d => ({
    ...d,
    date: d.date.slice(5), // "MM-DD"
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Growth Metrics</h1>
        <p className="text-gray-400 text-sm mt-1">Track platform growth and user engagement (last 30 days)</p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={totals.users} icon={<Users size={20} />} index={0} />
        <StatCard label="Total Requests" value={totals.requests} icon={<Target size={20} />} index={1} />
        <StatCard label="Total Matches" value={totals.matches} icon={<TrendingUp size={20} />} index={2} />
        <StatCard label="Connections" value={totals.connections} icon={<LinkIcon size={20} />} index={3} />
      </div>

      {/* Daily Chart */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Activity (30 days)</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} name="Users" />
              <Line type="monotone" dataKey="requests" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Requests" />
              <Line type="monotone" dataKey="connections" stroke="#10b981" strokeWidth={2} dot={false} name="Connections" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No daily data available yet</p>
        )}
      </div>
      {/* User Funnel */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">User Funnel</h2>
        {funnelStages.length > 0 ? (
          <div className="space-y-4">
            {funnelStages.map((stage, idx) => (
              <div key={stage.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{stage.stage}</span>
                  <span className="font-semibold">{stage.count} ({stage.percentage}%)</span>
                </div>
                <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(stage.percentage, 2)}%`, opacity: 1 - (idx * 0.12) }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No funnel data yet</p>
        )}
      </div>
    </div>
  )
}