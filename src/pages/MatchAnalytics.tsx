import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Target, Zap, Link as LinkIcon, Users, RefreshCw } from 'lucide-react'
import api from '../utils/api'

interface MatchQualityData {
  funnel: {
    total_searches: number
    total_matches: number
    reach_outs: number
    skips: number
    connections: number
    gigs_hired: number
    gigs_talked: number
  }
  conversion_rates: {
    match_to_reachout_pct: number
    reachout_to_conn_pct: number
    conn_to_gig_pct: number
    followup_answer_rate: number
  }
  quality_distribution: Record<string, number>
  top_categories: Array<{ category: string; requests: number }>
  week_over_week: Record<string, { this_week: number; last_week: number; change_pct: number | null }>
  totals: { users: number; pros: number; hirers: number; passive_pros: number }
  generated_at: string
}

function WoWBadge({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-gray-500 text-xs">–</span>
  const positive = pct >= 0
  const Icon = pct > 0 ? TrendingUp : pct < 0 ? TrendingDown : Minus
  const color = pct > 0 ? 'text-green-400' : pct < 0 ? 'text-red-400' : 'text-gray-400'
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon size={12} />
      {positive && '+'}{pct}% WoW
    </span>
  )
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-semibold">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%`, transition: 'width 0.6s ease' }} />
      </div>
      <div className="text-right text-xs text-gray-500">{pct}% of top</div>
    </div>
  )
}

function ConvRate({ label, value, note }: { label: string; value: number; note?: string }) {
  const color = value >= 30 ? 'text-green-400' : value >= 15 ? 'text-yellow-400' : 'text-red-400'
  return (
    <div className="bg-gray-800 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}%</span>
      {note && <span className="text-gray-500 text-xs">{note}</span>}
    </div>
  )
}

export default function MatchAnalytics() {
  const [data, setData] = useState<MatchQualityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/admin/analytics/match-quality')
      setData(res.data)
    } catch (e: any) {
      setError(e?.response?.data?.detail || e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      <RefreshCw className="animate-spin mr-2" size={20} /> Loading analytics...
    </div>
  )

  if (error || !data) return (
    <div className="text-center py-12">
      <p className="text-red-400 mb-4">{error || 'No data'}</p>
      <button onClick={load} className="px-4 py-2 bg-blue-600 rounded-lg text-white text-sm">Retry</button>
    </div>
  )

  const { funnel, conversion_rates, quality_distribution, top_categories, week_over_week, totals } = data

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Match Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">
            Last updated {new Date(data.generated_at).toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',     value: totals.users,       icon: <Users size={18} />,    wow: week_over_week.new_users },
          { label: 'Total Searches',  value: funnel.total_searches, icon: <Target size={18} />, wow: week_over_week.new_requests },
          { label: 'Connections Made',value: funnel.connections, icon: <LinkIcon size={18} />,  wow: week_over_week.new_conns },
          { label: 'Gigs Confirmed',  value: funnel.gigs_hired,  icon: <Zap size={18} />,      wow: null },
        ].map(({ label, value, icon, wow }) => (
          <div key={label} className="bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-xs">{icon}{label}</div>
            <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
            <WoWBadge pct={wow?.change_pct ?? null} />
          </div>
        ))}
      </div>

      {/* Match Funnel */}
      <div className="bg-gray-800 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">Match Funnel</h2>
        <div className="space-y-4">
          <FunnelBar label="🔍 Searches"      value={funnel.total_searches} max={funnel.total_searches} color="bg-blue-500" />
          <FunnelBar label="🎯 Matches Sent"  value={funnel.total_matches}  max={funnel.total_searches} color="bg-indigo-500" />
          <FunnelBar label="👆 Reach Outs"    value={funnel.reach_outs}     max={funnel.total_searches} color="bg-violet-500" />
          <FunnelBar label="🤝 Connections"   value={funnel.connections}    max={funnel.total_searches} color="bg-purple-500" />
          <FunnelBar label="✅ Gigs Hired"    value={funnel.gigs_hired}     max={funnel.total_searches} color="bg-green-500" />
        </div>
      </div>

      {/* Conversion Rates */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Conversion Rates</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ConvRate label="Match → Reach Out"  value={conversion_rates.match_to_reachout_pct} note="hirers who act on matches" />
          <ConvRate label="Reach Out → Connect" value={conversion_rates.reachout_to_conn_pct}  note="pros who respond" />
          <ConvRate label="Connection → Gig"   value={conversion_rates.conn_to_gig_pct}        note="gigs confirmed or talked" />
          <ConvRate label="Follow-up Answer Rate" value={conversion_rates.followup_answer_rate} note="gig outcome responses" />
        </div>
      </div>

      {/* Quality Distribution + Top Categories side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Quality Score Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Match Quality Distribution</h2>
          {Object.entries(quality_distribution).length === 0 ? (
            <p className="text-gray-500 text-sm">No quality scores yet — will populate as matches come in.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(quality_distribution).map(([tier, count]) => {
                const total = Object.values(quality_distribution).reduce((a, b) => a + b, 0)
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                const tierColor = tier.includes('Excellent') ? 'bg-green-500'
                  : tier.includes('Strong') ? 'bg-blue-500'
                  : tier.includes('Good') ? 'bg-yellow-500'
                  : 'bg-gray-600'
                return (
                  <div key={tier} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{tier}</span>
                      <span className="text-white font-medium">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${tierColor}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Top Request Categories</h2>
          {top_categories.length === 0 ? (
            <p className="text-gray-500 text-sm">No category data yet.</p>
          ) : (
            <div className="space-y-2">
              {top_categories.map((cat, i) => {
                const max = top_categories[0].requests
                const pct = Math.round((cat.requests / max) * 100)
                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        <span className="text-gray-500 mr-2">#{i + 1}</span>
                        {cat.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-white font-medium">{cat.requests}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Week-over-week summary */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">This Week vs Last Week</h2>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(week_over_week).map(([key, stats]) => (
            <div key={key} className="space-y-1">
              <div className="text-gray-400 text-xs capitalize">{key.replace(/_/g, ' ')}</div>
              <div className="text-2xl font-bold text-white">{stats.this_week}</div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>prev: {stats.last_week}</span>
                <WoWBadge pct={stats.change_pct} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supply breakdown */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Supply Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users',    value: totals.users },
            { label: 'Professionals', value: totals.pros },
            { label: 'Hirers',        value: totals.hirers },
            { label: 'Passive Pros',  value: totals.passive_pros },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white">{value.toLocaleString()}</div>
              <div className="text-gray-400 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
