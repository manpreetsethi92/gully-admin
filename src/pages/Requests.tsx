import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { Target, Clock, CheckCircle } from 'lucide-react'
import { fetchRequests } from '../utils/api'
import { Request } from '../types'
import { formatRelativeTime, truncate } from '../utils/format'
import { getStatusColor } from '../utils/colors'

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 })

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const data = await fetchRequests(200, 1)
      const reqs: Request[] = Array.isArray(data.requests) ? data.requests : data
      // Compute budget_display client-side since it's not stored in DB
      const enriched = reqs.map((r: Request) => ({
        ...r,
        budget_display: r.budget_display || (
          r.budget_min != null && r.budget_max != null
            ? `$${r.budget_min}–$${r.budget_max}`
            : r.budget_min != null
            ? `From $${r.budget_min}`
            : r.budget_max != null
            ? `Up to $${r.budget_max}`
            : undefined
        ),
      }))
      setRequests(enriched)
      setStats({
        total: enriched.length,
        active: enriched.filter((r: Request) => r.status === 'active' || r.status === 'matching').length,
        completed: enriched.filter((r: Request) => r.status === 'completed').length,
      })
    } catch (error) {
      console.error('Failed to load requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'title' as const, label: 'Title', render: (val: string) => <span className="font-medium">{truncate(val, 50)}</span> },
    { key: 'category' as const, label: 'Category', render: (val: string) => <span className="text-sm text-gray-400">{val}</span> },
    { key: 'location' as const, label: 'Location', render: (val?: string) => <span>{val || '—'}</span> },
    { key: 'budget_display' as const, label: 'Budget', render: (val?: string) => <span>{val || '—'}</span> },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(val)}`}>{val}</span>
    ) },
    { key: 'created_at' as const, label: 'Created', render: (val: string) => <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Requests</h1>
        <p className="text-gray-400 text-sm mt-1">Manage user requests for jobs and collaborations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Requests" value={stats.total} icon={<Target size={20} />} index={0} />
        <StatCard label="Active" value={stats.active} icon={<Clock size={20} />} index={1} />
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle size={20} />} index={2} />
      </div>

      <DataTable<Request>
        columns={columns}
        data={requests}
        loading={loading}
        rowKey="id"
      />
    </div>
  )
}
