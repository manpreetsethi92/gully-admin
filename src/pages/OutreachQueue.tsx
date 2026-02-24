import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import DataTable from '../components/DataTable'
import { Send, Clock, CheckCircle, RefreshCw } from 'lucide-react'
import { fetchOutreachDashboard, markOutreachSent, markOutreachReplied } from '../utils/api'
import { formatRelativeTime } from '../utils/format'

interface OutreachItem {
  id: string
  name: string
  linkedin_url?: string
  status: string
  skills?: string[]
  created_at: string
  sent_at?: string
}

interface OutreachData {
  pending_count: number
  sent_count: number
  replied_count: number
  queue: OutreachItem[]
}

export default function OutreachQueue() {
  const [data, setData] = useState<OutreachData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchOutreachDashboard()
      setData(res)
    } catch (err: any) {
      setError(err.message || 'Failed to load outreach data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleMarkSent = async (id: string) => {
    try {
      await markOutreachSent(id)
      load()
    } catch (err) {
      console.error('Failed to mark sent:', err)
    }
  }

  const handleMarkReplied = async (id: string) => {
    try {
      await markOutreachReplied(id)
      load()
    } catch (err) {
      console.error('Failed to mark replied:', err)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading outreach queue...</div>
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!data) return <ErrorState message="No outreach data available" onRetry={load} />

  const columns = [
    { key: 'name' as const, label: 'Name', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'linkedin_url' as const, label: 'LinkedIn', render: (val?: string) => val ? (
      <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Profile</a>
    ) : <span className="text-gray-500">—</span> },
    { key: 'skills' as const, label: 'Skills', render: (val?: string[]) => (
      <div className="flex flex-wrap gap-1">{(val || []).slice(0, 3).map((s, i) => (
        <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">{s}</span>
      ))}</div>
    ) },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
        val === 'replied' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
        val === 'sent' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
        'bg-gray-500/20 text-gray-400 border-gray-500/30'
      }`}>{val}</span>
    ) },
    { key: 'created_at' as const, label: 'Added', render: (val: string) => <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span> },
    { key: 'id' as const, label: 'Actions', render: (_val: string, row: OutreachItem) => (
      <div className="flex gap-2">
        {row.status === 'pending' && (
          <button onClick={(e) => { e.stopPropagation(); handleMarkSent(row.id) }} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500/30">Mark Sent</button>
        )}
        {row.status === 'sent' && (
          <button onClick={(e) => { e.stopPropagation(); handleMarkReplied(row.id) }} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30">Mark Replied</button>
        )}
      </div>
    ) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outreach Queue</h1>
          <p className="text-gray-400 text-sm mt-1">LinkedIn outreach tracking and management</p>
        </div>
        <button onClick={load} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Refresh">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Pending" value={data.pending_count} icon={<Clock size={20} />} index={2} />
        <StatCard label="Sent" value={data.sent_count} icon={<Send size={20} />} index={0} />
        <StatCard label="Replied" value={data.replied_count} icon={<CheckCircle size={20} />} index={1} />
      </div>

      <DataTable<OutreachItem>
        columns={columns}
        data={data.queue || []}
        loading={loading}
        rowKey="id"
      />
    </div>
  )
}
