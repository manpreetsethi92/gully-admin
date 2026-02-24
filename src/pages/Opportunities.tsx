import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import DataTable from '../components/DataTable'
import { Target, Clock, CheckCircle, RefreshCw } from 'lucide-react'
import { fetchOpportunities } from '../utils/api'
import { formatRelativeTime, truncate } from '../utils/format'
import { getStatusColor } from '../utils/colors'

interface Opportunity {
  id: string
  title: string
  category?: string
  location?: string
  status: string
  matches_count?: number
  created_at: string
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchOpportunities(100)
      const list = Array.isArray(res.opportunities) ? res.opportunities : Array.isArray(res) ? res : []
      setOpportunities(list)
    } catch (err: any) {
      setError(err.message || 'Failed to load opportunities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading opportunities...</div>
  if (error) return <ErrorState message={error} onRetry={load} />

  const stats = {
    total: opportunities.length,
    active: opportunities.filter(o => o.status === 'active' || o.status === 'open').length,
    completed: opportunities.filter(o => o.status === 'completed' || o.status === 'filled').length,
  }

  const columns = [
    { key: 'title' as const, label: 'Title', render: (val: string) => <span className="font-medium">{truncate(val, 50)}</span> },
    { key: 'category' as const, label: 'Category', render: (val?: string) => <span className="text-sm text-gray-400">{val || '—'}</span> },
    { key: 'location' as const, label: 'Location', render: (val?: string) => <span>{val || '—'}</span> },
    { key: 'matches_count' as const, label: 'Matches', render: (val?: number) => <span className="font-semibold">{val || 0}</span> },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(val)}`}>{val}</span>
    ) },
    { key: 'created_at' as const, label: 'Created', render: (val: string) => <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Opportunities</h1>
          <p className="text-gray-400 text-sm mt-1">Active opportunities pushed to professionals</p>
        </div>
        <button onClick={load} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Opportunities" value={stats.total} icon={<Target size={20} />} index={0} />
        <StatCard label="Active" value={stats.active} icon={<Clock size={20} />} index={1} />
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle size={20} />} index={2} />
      </div>

      <DataTable<Opportunity>
        columns={columns}
        data={opportunities}
        loading={loading}
        rowKey="id"
      />
    </div>
  )
}
