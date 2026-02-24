import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import { DollarSign, TrendingDown, Bot, Zap } from 'lucide-react'
import { fetchAICosts } from '../utils/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface AICostData {
  total_cost: number
  total_saved: number
  daily: Array<{ date: string; cost: number; calls: number }>
  by_model: Array<{ model: string; cost: number; calls: number }>
  avg_daily: number
}

export default function AICosts() {
  const [data, setData] = useState<AICostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchAICosts(30)
      setData(res)
    } catch (err: any) {
      setError(err.message || 'Failed to load AI cost data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading AI costs...</div>
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!data) return <ErrorState message="No AI cost data available" onRetry={load} />

  const chartData = (data.daily || []).map(d => ({
    ...d,
    date: d.date.slice(5),
    cost: Number(d.cost.toFixed(2)),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Costs</h1>
        <p className="text-gray-400 text-sm mt-1">Track AI API spending and cost optimization (last 30 days)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Spend (30d)" value={`$${data.total_cost.toFixed(2)}`} icon={<DollarSign size={20} />} index={4} />
        <StatCard label="Cost Saved" value={`$${data.total_saved.toFixed(2)}`} icon={<TrendingDown size={20} />} index={1} />
        <StatCard label="Avg Daily" value={`$${data.avg_daily.toFixed(2)}`} icon={<Zap size={20} />} index={0} />
        <StatCard label="Models Used" value={(data.by_model || []).length} icon={<Bot size={20} />} index={5} />
      </div>

      {/* Daily Cost Chart */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Spend</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} formatter={(v: number) => [`$${v.toFixed(2)}`, 'Cost']} />
              <Line type="monotone" dataKey="cost" stroke="#E50914" strokeWidth={2} dot={false} name="Cost" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No daily cost data yet</p>
        )}
      </div>

      {/* Cost by Model */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Cost by Model</h2>
        {(data.by_model || []).length > 0 ? (
          <div className="space-y-3">
            {data.by_model.map((m) => (
              <div key={m.model} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                <div>
                  <span className="font-medium">{m.model}</span>
                  <span className="text-gray-400 text-sm ml-3">{m.calls.toLocaleString()} calls</span>
                </div>
                <span className="font-semibold text-accent">${m.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No model breakdown available</p>
        )}
      </div>
    </div>
  )
}
