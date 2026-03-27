import { useEffect, useState } from 'react'
import { TrendingUp, Target, BarChart3 } from 'lucide-react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { fetchRateBenchmarks, fetchRateTrends, fetchBenchmarkAccuracy } from '../utils/api'

interface RateBenchmark {
  id: string
  skill: string
  metro_area: string
  week: string
  min_rate: number
  max_rate: number
  avg_rate: number
  market_demand: string
  sample_size: number
}

interface RateTrend {
  week: string
  skill: string
  metro: string
  rate: number
  trend_percent: number
}

interface AccuracyMetric {
  skill: string
  metro: string
  predicted_rate: number
  actual_rate: number
  error_percent: number
  prediction_date: string
}

export default function RateBenchmarks() {
  const [benchmarks, setBenchmarks] = useState<RateBenchmark[]>([])
  const [trends, setTrends] = useState<RateTrend[]>([])
  const [accuracy, setAccuracy] = useState<AccuracyMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'trends' | 'accuracy'>('benchmarks')
  const [stats, setStats] = useState({ totalSkills: 0, avgRate: 0, highestDemand: 0 })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [benchData, trendsData, accData] = await Promise.all([
        fetchRateBenchmarks(),
        fetchRateTrends(),
        fetchBenchmarkAccuracy(),
      ])

      const processedBench = Array.isArray(benchData.benchmarks) ? benchData.benchmarks : []
      const processedTrends = Array.isArray(trendsData.trends) ? trendsData.trends : []
      const processedAcc = Array.isArray(accData.accuracy) ? accData.accuracy : []

      setBenchmarks(processedBench)
      setTrends(processedTrends)
      setAccuracy(processedAcc)

      const uniqueSkills = new Set(processedBench.map((b: RateBenchmark) => b.skill)).size
      const avgRate = processedBench.length > 0 ? processedBench.reduce((sum: number, b: RateBenchmark) => sum + b.avg_rate, 0) / processedBench.length : 0
      const highDemand = processedBench.filter((b: RateBenchmark) => b.market_demand === 'high').length

      setStats({
        totalSkills: uniqueSkills,
        avgRate: parseFloat(avgRate.toFixed(2)),
        highestDemand: highDemand,
      })
    } catch (error) {
      console.error('Failed to load rate benchmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const benchmarkColumns = [
    { key: 'skill' as const, label: 'Skill', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-medium">{val}</span> },
    { key: 'metro_area' as const, label: 'Metro', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'week' as const, label: 'Week', render: (val: string) => <span className="text-sm text-gray-400">{val}</span> },
    { key: 'min_rate' as const, label: 'Min Rate', render: (val: number) => <span>${val.toFixed(2)}</span> },
    { key: 'avg_rate' as const, label: 'Avg Rate', render: (val: number) => <span className="font-semibold text-accent">${val.toFixed(2)}</span> },
    { key: 'max_rate' as const, label: 'Max Rate', render: (val: number) => <span>${val.toFixed(2)}</span> },
    { key: 'market_demand' as const, label: 'Demand', render: (val: string) => (
      <span className={`text-xs px-2 py-1 rounded ${val === 'high' ? 'bg-red-400/20 text-red-400' : val === 'medium' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-400/20 text-gray-400'}`}>
        {val.charAt(0).toUpperCase() + val.slice(1)}
      </span>
    ) },
    { key: 'sample_size' as const, label: 'Sample Size', render: (val: number) => <span className="text-sm">{val} gigs</span> },
  ]

  const trendsColumns = [
    { key: 'skill' as const, label: 'Skill', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-medium">{val}</span> },
    { key: 'metro' as const, label: 'Metro', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'week' as const, label: 'Week', render: (val: string) => <span className="text-sm text-gray-400">{val}</span> },
    { key: 'rate' as const, label: 'Rate', render: (val: number) => <span className="font-semibold">${val.toFixed(2)}</span> },
    { key: 'trend_percent' as const, label: 'Trend', render: (val: number) => (
      <span className={`font-semibold ${val > 0 ? 'text-green-400' : 'text-red-400'}`}>{val > 0 ? '+' : ''}{val.toFixed(1)}%</span>
    ) },
  ]

  const accuracyColumns = [
    { key: 'skill' as const, label: 'Skill', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-medium">{val}</span> },
    { key: 'metro' as const, label: 'Metro', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'predicted_rate' as const, label: 'Predicted', render: (val: number) => <span>${val.toFixed(2)}</span> },
    { key: 'actual_rate' as const, label: 'Actual', render: (val: number) => <span className="font-semibold">${val.toFixed(2)}</span> },
    { key: 'error_percent' as const, label: 'Error', render: (val: number) => (
      <span className={`font-semibold ${val < 5 ? 'text-green-400' : val < 10 ? 'text-yellow-400' : 'text-red-400'}`}>{val.toFixed(2)}%</span>
    ) },
    { key: 'prediction_date' as const, label: 'Predicted', render: (val: string) => <span className="text-sm text-gray-400">{new Date(val).toLocaleDateString()}</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rate Benchmarks</h1>
        <p className="text-gray-400 text-sm mt-1">Skill pricing by metro area and market trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Skills Tracked" value={stats.totalSkills} icon={<Target size={20} />} index={0} />
        <StatCard label="Average Rate" value={`$${stats.avgRate.toFixed(2)}`} icon={<BarChart3 size={20} />} index={1} />
        <StatCard label="High Demand" value={stats.highestDemand} icon={<TrendingUp size={20} />} index={2} />
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg">
        <div className="border-b border-dark-border p-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'benchmarks' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'trends' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Rate Trends
          </button>
          <button
            onClick={() => setActiveTab('accuracy')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'accuracy' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Prediction Accuracy
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'benchmarks' && <DataTable<RateBenchmark> columns={benchmarkColumns} data={benchmarks} loading={loading} rowKey="id" />}
          {activeTab === 'trends' && <DataTable<RateTrend> columns={trendsColumns} data={trends} loading={loading} rowKey="week" />}
          {activeTab === 'accuracy' && <DataTable<AccuracyMetric> columns={accuracyColumns} data={accuracy} loading={loading} rowKey="prediction_date" />}
        </div>
      </div>
    </div>
  )
}