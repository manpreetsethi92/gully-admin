import { useEffect, useState } from 'react'
import { fetchRevenueAttribution } from '../utils/api'
import { DollarSign, TrendingUp, Target, Zap } from 'lucide-react'

interface CategoryData {
  category: string
  hits?: number
  conversions?: number
}

interface RevenueData {
  total_paywall_hits: number
  total_converted: number
  conversion_rate: number
  top_hit_categories: CategoryData[]
  top_converted_categories: CategoryData[]
}

export default function RevenueAttribution() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRevenueAttribution()
        setData(res)
      } catch (err) {
        console.error('Failed to load revenue data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading revenue data...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue Attribution</h1>
        <p className="text-gray-400 text-sm mt-1">Paywall hits → subscription conversions (last 30 days)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="text-gray-400 text-sm flex items-center gap-2"><Target size={16} /> Paywall Hits</div>
          <div className="text-2xl font-bold mt-1">{data?.total_paywall_hits || 0}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="text-green-400 text-sm flex items-center gap-2"><DollarSign size={16} /> Conversions</div>
          <div className="text-2xl font-bold mt-1">{data?.total_converted || 0}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="text-accent text-sm flex items-center gap-2"><TrendingUp size={16} /> Rate</div>
          <div className="text-2xl font-bold mt-1">{data?.conversion_rate || 0}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Top Categories (Paywall Hits)</h3>
          {(data?.top_hit_categories || []).length === 0 ? (
            <p className="text-gray-500 text-sm">No paywall hits yet</p>
          ) : (
            <div className="space-y-2">
              {data?.top_hit_categories.map((cat, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="capitalize text-sm">{cat.category || 'unknown'}</span>
                  <span className="text-gray-400 font-mono text-sm">{cat.hits}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><DollarSign size={18} className="text-green-400" /> Top Categories (Conversions)</h3>
          {(data?.top_converted_categories || []).length === 0 ? (
            <p className="text-gray-500 text-sm">No conversions yet</p>
          ) : (
            <div className="space-y-2">
              {data?.top_converted_categories.map((cat, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="capitalize text-sm">{cat.category || 'unknown'}</span>
                  <span className="text-green-400 font-mono text-sm">{cat.conversions}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
