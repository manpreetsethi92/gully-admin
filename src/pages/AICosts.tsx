import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import { DollarSign, TrendingDown, Bot, Zap } from 'lucide-react'
import { fetchAICosts } from '../utils/api'

interface AICostData {
  totals: { cost: number; saved: number; jobs: number; cost_per_job: number; estimated?: boolean }
  breakdown: { haiku: number; batch: number }
  period_days: number
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

  const t = data.totals
  const savingsPercent = t.saved && t.cost ? Math.round(t.saved / (t.cost + t.saved) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Costs</h1>
        <p className="text-gray-400 text-sm mt-1">Track AI API spending and cost optimization (last {data.period_days} days)</p>
      </div>

      {t.estimated && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-400">
          These are estimated costs. Enable AI cost logging for accurate tracking.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Cost" value={`$${t.cost.toFixed(2)}`} icon={<DollarSign size={20} />} index={4} />
        <StatCard label="Cost Saved" value={`$${t.saved.toFixed(2)}`} icon={<TrendingDown size={20} />} index={1} />
        <StatCard label="Jobs Processed" value={t.jobs.toLocaleString()} icon={<Zap size={20} />} index={0} />
        <StatCard label="Cost / Job" value={`$${t.cost_per_job.toFixed(4)}`} icon={<Bot size={20} />} index={2} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Cost Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-gray-400">Haiku Gate</span>
              </div>
              <span className="font-semibold">${data.breakdown.haiku.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-400">Batch Classifier</span>
              </div>
              <span className="font-semibold">${data.breakdown.batch.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Efficiency */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Efficiency</h2>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">{savingsPercent}%</div>
              <div className="text-gray-400 text-sm">Cost saved by Haiku filtering</div>
              <div className="text-gray-500 text-xs mt-2">${t.saved.toFixed(2)} saved out of ${(t.cost + t.saved).toFixed(2)} potential</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
