import { useEffect, useState } from 'react'
import { Activity, Zap, TrendingUp, Clock } from 'lucide-react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { fetchLiveSignalFeed, fetchSignalConversionRate, fetchSignalConfidence, fetchUnfilledSignals } from '../utils/api'

interface Signal {
  signal_id: string
  source: 'reddit' | 'x' | 'threads'
  content: string
  author: string
  timestamp: string
  status: 'processing' | 'matched' | 'unmatched'
  confidence: number
}

interface ConversionMetrics {
  total_signals: number
  converted_to_gigs: number
  conversion_rate: number
  avg_time_to_conversion: number
  source_breakdown: { source: string; signals: number; conversions: number }[]
}

interface ConfidenceDistribution {
  bucket: string
  count: number
  percentage: number
}

interface UnfilledSignal {
  signal_id: string
  skill_required: string
  location: string
  urgency: string
  posted_hours_ago: number
  potential_matches: number
  confidence_score: number
}

export default function SocialListening() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [conversionData, setConversionData] = useState<ConversionMetrics | null>(null)
  const [confidenceData, setConfidenceData] = useState<ConfidenceDistribution[]>([])
  const [unfilledSignals, setUnfilledSignals] = useState<UnfilledSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'feed' | 'conversion' | 'confidence' | 'unfilled'>('feed')
  const [stats, setStats] = useState({ totalSignals: 0, processingRate: 0, avgConfidence: 0 })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [feedData, convData, confData, unfilledData] = await Promise.all([
        fetchLiveSignalFeed(),
        fetchSignalConversionRate(),
        fetchSignalConfidence(),
        fetchUnfilledSignals(),
      ])

      const processedSignals = Array.isArray(feedData.signals) ? feedData.signals : []
      const processedConv = convData.metrics || null
      const processedConf = Array.isArray(confData.distribution) ? confData.distribution : []
      const processedUnfilled = Array.isArray(unfilledData.unfilled) ? unfilledData.unfilled : []

      setSignals(processedSignals)
      setConversionData(processedConv)
      setConfidenceData(processedConf)
      setUnfilledSignals(processedUnfilled)

      const avgConf = processedSignals.length > 0 ? processedSignals.reduce((sum, s) => sum + s.confidence, 0) / processedSignals.length : 0

      setStats({
        totalSignals: processedSignals.length,
        processingRate: processedSignals.filter((s) => s.status === 'processing').length,
        avgConfidence: parseFloat(avgConf.toFixed(2)),
      })
    } catch (error) {
      console.error('Failed to load social listening data:', error)
    } finally {
      setLoading(false)
    }
  }

  const feedColumns = [
    { key: 'source' as const, label: 'Source', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded uppercase">{val}</span> },
    { key: 'author' as const, label: 'Author', render: (val: string) => <span className="text-sm">{val}</span> },
    { key: 'content' as const, label: 'Content', render: (val: string) => <span className="text-sm text-gray-300 line-clamp-2">{val.substring(0, 100)}...</span> },
    { key: 'confidence' as const, label: 'Confidence', render: (val: number) => <span className="font-semibold text-accent">{(val * 100).toFixed(0)}%</span> },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`text-xs px-2 py-1 rounded ${val === 'matched' ? 'bg-green-400/20 text-green-400' : val === 'processing' ? 'bg-blue-400/20 text-blue-400' : 'bg-gray-400/20 text-gray-400'}`}>
        {val.charAt(0).toUpperCase() + val.slice(1)}
      </span>
    ) },
    { key: 'timestamp' as const, label: 'Posted', render: (val: string) => <span className="text-sm text-gray-400">{new Date(val).toLocaleTimeString()}</span> },
  ]

  const confidenceColumns = [
    { key: 'bucket' as const, label: 'Confidence Range', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'count' as const, label: 'Signals', render: (val: number) => <span className="text-center">{val}</span> },
    { key: 'percentage' as const, label: 'Percentage', render: (val: number) => <span className="font-semibold">{val.toFixed(1)}%</span> },
  ]

  const unfilledColumns = [
    { key: 'skill_required' as const, label: 'Skill', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">{val}</span> },
    { key: 'location' as const, label: 'Location', render: (val: string) => <span className="text-sm">{val}</span> },
    { key: 'urgency' as const, label: 'Urgency', render: (val: string) => <span className={`text-xs px-2 py-1 rounded ${val === 'high' ? 'bg-red-400/20 text-red-400' : 'bg-yellow-400/20 text-yellow-400'}`}>{val.toUpperCase()}</span> },
    { key: 'posted_hours_ago' as const, label: 'Posted', render: (val: number) => <span className="text-sm">{val}h ago</span> },
    { key: 'potential_matches' as const, label: 'Potential Matches', render: (val: number) => <span className="font-semibold text-green-400">{val}</span> },
    { key: 'confidence_score' as const, label: 'Confidence', render: (val: number) => <span>{(val * 100).toFixed(0)}%</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Social Listening Monitor</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time signal processing from Reddit, X, and Threads</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Signals" value={stats.totalSignals} icon={<Activity size={20} />} index={0} />
        <StatCard label="Processing" value={stats.processingRate} icon={<Clock size={20} />} index={1} />
        <StatCard label="Avg Confidence" value={`${(stats.avgConfidence * 100).toFixed(0)}%`} icon={<Zap size={20} />} index={2} />
      </div>

      {conversionData && (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Signal to Gig Conversion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
              <p className="text-3xl font-bold text-accent">{(conversionData.conversion_rate * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Converted</p>
              <p className="text-3xl font-bold text-green-400">{conversionData.converted_to_gigs.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Time to Conversion</p>
              <p className="text-3xl font-bold">{conversionData.avg_time_to_conversion.toFixed(1)}h</p>
            </div>
          </div>
          {conversionData.source_breakdown && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-dark-border">
              {conversionData.source_breakdown.map((source, idx) => (
                <div key={idx}>
                  <p className="text-gray-400 text-sm uppercase">{source.source}</p>
                  <p className="font-semibold">{source.signals} signals → {source.conversions} gigs</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-dark-surface border border-dark-border rounded-lg">
        <div className="border-b border-dark-border p-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'feed' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Live Feed
          </button>
          <button
            onClick={() => setActiveTab('confidence')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'confidence' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Confidence Distribution
          </button>
          <button
            onClick={() => setActiveTab('unfilled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'unfilled' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Unfilled Queue
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'feed' && <DataTable<Signal> columns={feedColumns} data={signals} loading={loading} rowKey="signal_id" />}
          {activeTab === 'confidence' && <DataTable<ConfidenceDistribution> columns={confidenceColumns} data={confidenceData} loading={loading} rowKey="bucket" />}
          {activeTab === 'unfilled' && <DataTable<UnfilledSignal> columns={unfilledColumns} data={unfilledSignals} loading={loading} rowKey="signal_id" />}
        </div>
      </div>
    </div>
  )
}