import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, Target, Zap } from 'lucide-react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { fetchActiveCampaigns, fetchCampaignPerformance, fetchAdRevenueDashboard, fetchGigAdvances, fetchAdvanceRepayment } from '../utils/api'

interface Campaign {
  id: string
  talent_id: string
  talent_name: string
  category: string
  status: 'active' | 'paused' | 'ended'
  boost_level: number
  start_date: string
  end_date: string
}

interface CampaignMetrics {
  campaign_id: string
  talent_name: string
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  conversion_rate: number
  spend: number
  revenue: number
  roi: number
}

interface AdRevenue {
  total_daily_revenue: number
  total_weekly_revenue: number
  total_monthly_revenue: number
  active_campaigns: number
  avg_roi: number
  top_category: string
}

interface GigAdvance {
  advance_id: string
  talent_id: string
  talent_name: string
  amount: number
  status: 'pending' | 'approved' | 'disbursed'
  requested_date: string
  eligibility_score: number
}

interface AdvanceRepayment {
  repayment_id: string
  talent_id: string
  talent_name: string
  advance_amount: number
  remaining_balance: number
  monthly_deduction: number
  paid_date: string
  due_date: string
  status: 'on_track' | 'at_risk' | 'completed'
}

export default function AdsCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [metrics, setMetrics] = useState<CampaignMetrics[]>([])
  const [adRevenue, setAdRevenue] = useState<AdRevenue | null>(null)
  const [advances, setAdvances] = useState<GigAdvance[]>([])
  const [repayments, setRepayments] = useState<AdvanceRepayment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'campaigns' | 'performance' | 'advances' | 'repayments'>('campaigns')

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [campsData, metricsData, revenueData, advancesData, repayData] = await Promise.all([
        fetchActiveCampaigns(),
        fetchCampaignPerformance(),
        fetchAdRevenueDashboard(),
        fetchGigAdvances(),
        fetchAdvanceRepayment(),
      ])

      const processedCamps = Array.isArray(campsData.campaigns) ? campsData.campaigns : []
      const processedMetrics = Array.isArray(metricsData.metrics) ? metricsData.metrics : []
      const processedRevenue = revenueData.revenue || null
      const processedAdvances = Array.isArray(advancesData.advances) ? advancesData.advances : []
      const processedRepay = Array.isArray(repayData.repayments) ? repayData.repayments : []

      setCampaigns(processedCamps)
      setMetrics(processedMetrics)
      setAdRevenue(processedRevenue || (processedCamps.length > 0 ? {
        total_daily_revenue: 0,
        total_weekly_revenue: 0,
        total_monthly_revenue: 0,
        active_campaigns: processedCamps.length,
        avg_roi: 0,
        top_category: ''
      } : null))
      setAdvances(processedAdvances)
      setRepayments(processedRepay)
    } catch (error) {
      console.error('Failed to load ads campaigns data:', error)
    } finally {
      setLoading(false)
    }
  }

  const campaignColumns = [
    { key: 'talent_name' as const, label: 'Talent', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'category' as const, label: 'Category', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">{val}</span> },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`text-xs px-2 py-1 rounded ${val === 'active' ? 'bg-green-400/20 text-green-400' : val === 'paused' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-400/20 text-gray-400'}`}>
        {val.charAt(0).toUpperCase() + val.slice(1)}
      </span>
    ) },
    { key: 'boost_level' as const, label: 'Boost Level', render: (val: number) => <span>{val}x</span> },
    { key: 'start_date' as const, label: 'Started', render: (val: string) => <span className="text-sm text-gray-400">{new Date(val).toLocaleDateString()}</span> },
  ]

  const performanceColumns = [
    { key: 'talent_name' as const, label: 'Talent', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'impressions' as const, label: 'Impressions', render: (val: number) => <span>{val.toLocaleString()}</span> },
    { key: 'clicks' as const, label: 'Clicks', render: (val: number) => <span>{val.toLocaleString()}</span> },
    { key: 'conversions' as const, label: 'Conversions', render: (val: number) => <span className="font-semibold text-green-400">{val}</span> },
    { key: 'ctr' as const, label: 'CTR', render: (val: number) => <span>{(val * 100).toFixed(2)}%</span> },
    { key: 'conversion_rate' as const, label: 'Conv. Rate', render: (val: number) => <span>{(val * 100).toFixed(2)}%</span> },
    { key: 'roi' as const, label: 'ROI', render: (val: number) => <span className={`font-semibold ${val > 0 ? 'text-green-400' : 'text-red-400'}`}>{(val * 100).toFixed(1)}%</span> },
  ]

  const advanceColumns = [
    { key: 'talent_name' as const, label: 'Talent', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'amount' as const, label: 'Amount', render: (val: number) => <span className="font-semibold">${val.toLocaleString()}</span> },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`text-xs px-2 py-1 rounded ${val === 'approved' ? 'bg-green-400/20 text-green-400' : val === 'disbursed' ? 'bg-blue-400/20 text-blue-400' : 'bg-yellow-400/20 text-yellow-400'}`}>
        {val.charAt(0).toUpperCase() + val.slice(1)}
      </span>
    ) },
    { key: 'eligibility_score' as const, label: 'Eligibility', render: (val: number) => <span>{(val * 100).toFixed(0)}%</span> },
    { key: 'requested_date' as const, label: 'Requested', render: (val: string) => <span className="text-sm text-gray-400">{new Date(val).toLocaleDateString()}</span> },
  ]

  const repaymentColumns = [
    { key: 'talent_name' as const, label: 'Talent', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'advance_amount' as const, label: 'Advance', render: (val: number) => <span>${val.toLocaleString()}</span> },
    { key: 'remaining_balance' as const, label: 'Balance', render: (val: number) => <span className="font-semibold">${val.toLocaleString()}</span> },
    { key: 'monthly_deduction' as const, label: 'Monthly', render: (val: number) => <span>${val.toLocaleString()}</span> },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`text-xs px-2 py-1 rounded ${val === 'on_track' ? 'bg-green-400/20 text-green-400' : val === 'at_risk' ? 'bg-red-400/20 text-red-400' : 'bg-gray-400/20 text-gray-400'}`}>
        {val.replace('_', ' ').toUpperCase()}
      </span>
    ) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ads & Revenue Operations</h1>
        <p className="text-gray-400 text-sm mt-1">Campaign management, performance tracking, and gig advances</p>
      </div>

      {adRevenue && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Daily Revenue" value={`$${adRevenue.total_daily_revenue.toLocaleString()}`} icon={<DollarSign size={20} />} index={0} />
          <StatCard label="Weekly Revenue" value={`$${adRevenue.total_weekly_revenue.toLocaleString()}`} icon={<TrendingUp size={20} />} index={1} />
          <StatCard label="Monthly Revenue" value={`$${adRevenue.total_monthly_revenue.toLocaleString()}`} icon={<Zap size={20} />} index={2} />
          <StatCard label="Active Campaigns" value={adRevenue.active_campaigns} icon={<Target size={20} />} index={3} />
          <StatCard label="Avg ROI" value={`${(adRevenue.avg_roi * 100).toFixed(1)}%`} icon={<TrendingUp size={20} />} index={4} />
        </div>
      )}

      <div className="bg-dark-surface border border-dark-border rounded-lg">
        <div className="border-b border-dark-border p-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'campaigns' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Active Campaigns
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'performance' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('advances')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'advances' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Gig Advances
          </button>
          <button
            onClick={() => setActiveTab('repayments')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'repayments' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Repayments
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'campaigns' && <DataTable<Campaign> columns={campaignColumns} data={campaigns} loading={loading} rowKey="id" />}
          {activeTab === 'performance' && <DataTable<CampaignMetrics> columns={performanceColumns} data={metrics} loading={loading} rowKey="campaign_id" />}
          {activeTab === 'advances' && <DataTable<GigAdvance> columns={advanceColumns} data={advances} loading={loading} rowKey="advance_id" />}
          {activeTab === 'repayments' && <DataTable<AdvanceRepayment> columns={repaymentColumns} data={repayments} loading={loading} rowKey="repayment_id" />}
        </div>
      </div>
    </div>
  )
}