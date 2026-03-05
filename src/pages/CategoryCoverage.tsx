import { useEffect, useState } from 'react'
import { fetchCategoryCoverage } from '../utils/api'
import { MapPin, AlertTriangle, Users, Layers } from 'lucide-react'

interface CoverageItem {
  skill: string
  location: string
  internal: number
  passive: number
  total: number
}

interface GapItem {
  category: string
  city: string
  current_count: number
  priority: string
}

interface CoverageData {
  total_combinations: number
  coverage: CoverageItem[]
  gaps: GapItem[]
  gap_count: number
}

export default function CategoryCoverage() {
  const [data, setData] = useState<CoverageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'coverage' | 'gaps'>('gaps')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCategoryCoverage()
        setData(res)
      } catch (err) {
        console.error('Failed to load category coverage:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading category coverage...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Category Coverage</h1>
        <p className="text-gray-400 text-sm mt-1">Profile density per skill × city — find and fill gaps</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="text-gray-400 text-sm flex items-center gap-2"><Layers size={16} /> Skill × City Combos</div>
          <div className="text-2xl font-bold mt-1">{data?.total_combinations || 0}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="text-red-400 text-sm flex items-center gap-2"><AlertTriangle size={16} /> Gaps Found</div>
          <div className="text-2xl font-bold mt-1">{data?.gap_count || 0}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="text-green-400 text-sm flex items-center gap-2"><Users size={16} /> Covered</div>
          <div className="text-2xl font-bold mt-1">{(data?.total_combinations || 0) - (data?.gap_count || 0)}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('gaps')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === 'gaps' ? 'bg-red-600 text-white' : 'bg-dark-surface text-gray-400 hover:text-white'}`}>
          Gaps ({data?.gap_count || 0})
        </button>
        <button onClick={() => setTab('coverage')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === 'coverage' ? 'bg-accent text-white' : 'bg-dark-surface text-gray-400 hover:text-white'}`}>
          Coverage Map
        </button>
      </div>

      {tab === 'gaps' ? (
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border text-gray-400">
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">City</th>
                <th className="text-right p-3">Current</th>
                <th className="text-center p-3">Priority</th>
              </tr>
            </thead>
            <tbody>
              {(data?.gaps || []).map((gap, i) => (
                <tr key={i} className="border-b border-dark-border/50 hover:bg-white/5">
                  <td className="p-3 font-medium capitalize">{gap.category}</td>
                  <td className="p-3 capitalize flex items-center gap-1"><MapPin size={14} className="text-gray-500" />{gap.city}</td>
                  <td className="p-3 text-right">{gap.current_count}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${gap.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {gap.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border text-gray-400">
                <th className="text-left p-3">Skill</th>
                <th className="text-left p-3">Location</th>
                <th className="text-right p-3">Internal</th>
                <th className="text-right p-3">Passive</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {(data?.coverage || []).map((item, i) => (
                <tr key={i} className="border-b border-dark-border/50 hover:bg-white/5">
                  <td className="p-3 font-medium capitalize">{item.skill}</td>
                  <td className="p-3 capitalize">{item.location}</td>
                  <td className="p-3 text-right">{item.internal}</td>
                  <td className="p-3 text-right text-gray-400">{item.passive}</td>
                  <td className="p-3 text-right font-semibold">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
