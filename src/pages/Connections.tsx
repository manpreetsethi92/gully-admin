import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import DataTable from '../components/DataTable'
import { Link as LinkIcon, CheckCircle, Clock, RefreshCw } from 'lucide-react'
import { fetchConnections } from '../utils/api'
import { formatRelativeTime } from '../utils/format'
import { getStatusColor } from '../utils/colors'

interface Connection {
  id: string
  user_name?: string
  professional_name?: string
  request_title?: string
  status: string
  created_at: string
}

export default function Connections() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchConnections(100)
      const list = Array.isArray(res.connections) ? res.connections : Array.isArray(res) ? res : []
      setConnections(list)
    } catch (err: any) {
      setError(err.message || 'Failed to load connections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading connections...</div>
  if (error) return <ErrorState message={error} onRetry={load} />

  const stats = {
    total: connections.length,
    active: connections.filter(c => c.status === 'active' || c.status === 'connected').length,
    pending: connections.filter(c => c.status === 'pending').length,
  }

  const columns = [
    { key: 'user_name' as const, label: 'User', render: (val?: string) => <span className="font-medium">{val || '—'}</span> },
    { key: 'professional_name' as const, label: 'Professional', render: (val?: string) => <span className="font-medium">{val || '—'}</span> },
    { key: 'request_title' as const, label: 'Request', render: (val?: string) => <span className="text-sm text-gray-400">{val || '—'}</span> },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(val)}`}>{val}</span>
    ) },
    { key: 'created_at' as const, label: 'Created', render: (val: string) => <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Connections</h1>
          <p className="text-gray-400 text-sm mt-1">User-professional connections made through the platform</p>
        </div>
        <button onClick={load} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Connections" value={stats.total} icon={<LinkIcon size={20} />} index={0} />
        <StatCard label="Active" value={stats.active} icon={<CheckCircle size={20} />} index={1} />
        <StatCard label="Pending" value={stats.pending} icon={<Clock size={20} />} index={2} />
      </div>

      <DataTable<Connection>
        columns={columns}
        data={connections}
        loading={loading}
        rowKey="id"
      />
    </div>
  )
}
