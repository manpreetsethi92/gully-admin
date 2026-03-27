import { useEffect, useState } from 'react'
import { TrendingUp, Target, BarChart3 } from 'lucide-react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { fetchDemandForecast, fetchSeasonalTrends, fetchForecastAccuracy } from '../utils/api'

interface DemandForecast {
  category: string
  city: string
  week: string
  forecasted_demand: number
  confidence_level: number
  trending_up: boolean
}

interface SeasonalTrend {
  category: string
  month: string
  avg_demand: number
  seasonal_factor: number
  year_over_year_change: number
}

interface AccuracyRecord {
  category: string
  city: string
  forecast_date: string
  forecasted: number
  actual: number
  accuracy_percent: number
}

export default function DemandForecasting() {
  const [forecasts, setForecasts] = useState<DemandForecast[]>([])
  const [seasonalTrends, setSeasonalTrends] = useState<SeasonalTrend[]>([])
  const [accuracy, setAccuracy] = useState<AccuracyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'forecast' | 'seasonal' | 'accuracy'>('forecast')
  const [stats, setStats] = useState({ avgConfidence: 0, trendingUp: 0, totalForecasts: 0 })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [forecastData, seasonalData, accuracyData] = await Promise.all([
        fetchDemandForecast(),
        fetchSeasonalTrends(),
        fetchForecastAccuracy(),
      ])

      const processedForecast = Array.isArray(forecastData.forecasts) ? forecastData.forecasts : []
      const processedSeasonal = Array.isArray(seasonalData.trends) ? seasonalData.trends : []
      const processedAccuracy = Array.isArray(accuracyData.accuracy) ? accuracyData.accuracy : []

      setForecasts(processedForecast)
      setSeasonalTrends(processedSeasonal)
      setAccuracy(processedAccuracy)

      const avgConf = processedForecast.length > 0 ? processedForecast.reduce((sum: number, f: DemandForecast) => sum + f.confidence_level, 0) / processedForecast.length : 0
      const trendingUp = processedForecast.filter((f: DemandForecast) => f.trending_up).length

      setStats({
        avgConfidence: parseFloat(avgConf.toFixed(1)),
        trendingUp,
        totalForecasts: processedForecast.length,
      })
    } catch (error) {
      console.error('Failed to load demand forecasting data:', error)
    } finally {
      setLoading(false)
    }
  }

  const forecastColumns = [
    { key: 'category' as const, label: 'Category', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-medium">{val}</span> },
    { key: 'city' as const, label: 'City', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'week' as const, label: 'Week', render: (val: string) => <span className="text-sm text-gray-400">{val}</span> },
    { key: 'forecasted_demand' as const, label: 'Forecasted Demand', render: (val: number) => <span className="font-semibold">{val.toLocaleString()} gigs</span> },
    { key: 'confidence_level' as const, label: 'Confidence', render: (val: number) => <span className="text-accent">{(val * 100).toFixed(0)}%</span> },
    { key: 'trending_up' as const, label: 'Trend', render: (val: boolean) => (
      <span className={`text-xs px-2 py-1 rounded ${val ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
        {val ? '↑ Up' : '↓ Down'}
      </span>
    ) },
  ]

  const seasonalColumns = [
    { key: 'category' as const, label: 'Category', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-medium">{val}</span> },
    { key: 'month' as const, label: 'Month', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'avg_demand' as const, label: 'Avg Demand', render: (val: number) => <span className="font-semibold">{val.toLocaleString()}</span> },
    { key: 'seasonal_factor' as const, label: 'Seasonal Factor', render: (val: number) => <span>{val.toFixed(2)}x</span> },
    { key: 'year_over_year_change' as const, label: 'YoY Change', render: (val: number) => (
      <span className={`font-semibold ${val > 0 ? 'text-green-400' : 'text-red-400'}`}>{val > 0 ? '+' : ''}{val.toFixed(1)}%</span>
    ) },
  ]

  const accuracyColumns = [
    { key: 'category' as const, label: 'Category', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-medium">{val}</span> },
    { key: 'city' as const, label: 'City', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'forecasted' as const, label: 'Forecasted', render: (val: number) => <span>{val.toLocaleString()}</span> },
    { key: 'actual' as const, label: 'Actual', render: (val: number) => <span className="font-semibold">{val.toLocaleString()}</span> },
    { key: 'accuracy_percent' as const, label: 'Accuracy', render: (val: number) => (
      <span className={`font-semibold ${val >= 90 ? 'text-green-400' : val >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>{val.toFixed(1)}%</span>
    ) },
    { key: 'forecast_date' as const, label: 'Date', render: (val: string) => <span className="text-sm text-gray-400">{new Date(val).toLocaleDateString()}</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demand Forecasting</h1>
        <p className="text-gray-400 text-sm mt-1">Category and location demand predictions with seasonal analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Forecasts" value={stats.totalForecasts} icon={<Target size={20} />} index={0} />
        <StatCard label="Avg Confidence" value={`${stats.avgConfidence}%`} icon={<BarChart3 size={20} />} index={1} />
        <StatCard label="Trending Up" value={stats.trendingUp} icon={<TrendingUp size={20} />} index={2} />
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg">
        <div className="border-b border-dark-border p-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'forecast' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Demand Forecast
          </button>
          <button
            onClick={() => setActiveTab('seasonal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'seasonal' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Seasonal Trends
          </button>
          <button
            onClick={() => setActiveTab('accuracy')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'accuracy' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Accuracy
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'forecast' && <DataTable<DemandForecast> columns={forecastColumns} data={forecasts} loading={loading} rowKey="week" />}
          {activeTab === 'seasonal' && <DataTable<SeasonalTrend> columns={seasonalColumns} data={seasonalTrends} loading={loading} rowKey="month" />}
          {activeTab === 'accuracy' && <DataTable<AccuracyRecord> columns={accuracyColumns} data={accuracy} loading={loading} rowKey="forecast_date" />}
        </div>
      </div>
    </div>
  )
}