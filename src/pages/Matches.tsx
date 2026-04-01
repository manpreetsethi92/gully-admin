import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { LinkIcon, TrendingUp } from 'lucide-react'
import { fetchMatches } from '../utils/api'
import { Match } from '../types'
import { formatRelativeTime } from '../utils/format'
import { getStatusColor } from '../utils/colors'

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, converted: 0 })

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      const data = await fetchMatches(500)
      const mtchs: Match[] = Array.isArray(data.matches) ? data.matches : Array.isArray(data) ? data : []
      setMatches(mtchs)
      setStats({
        total: mtchs.length,
        pending: mtchs.filter((m: Match) => m.status === 'suggested' || m.status === 'pending').length,
        converted: mtchs.filter((m: Match) => m.status === 'converted' || m.status === 'accepted' || m.status === 'connected').length,
      })
    } catch (error) {
      console.error('Failed to load matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'matched_user_id' as const, label: 'User', render: (val: string) => <span className="text-sm">{val?.slice(0, 20) || '—'}</span> },
    { key: 'match_score' as const, label: 'Score', render: (val: number) => <span className="font-semibold">{val != null ? Math.round(val) + '%' : '—'}</span> },
    { key: 'request_id' as const, label: 'Request', render: (val: string) => <span className="text-sm text-gray-400">{val?.slice(0, 20) || '—'}</span> },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(val)}`}>{val}</span>
    ) },
    { key: 'created_at' as const, label: 'Created', render: (val: string) => <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Matches</h1>
        <p className="text-gray-400 text-sm mt-1">Track AI-powered matches between users and requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Matches" value={stats.total} icon={<LinkIcon size={20} />} index={0} />
        <StatCard label="Pending" value={stats.pending} icon={<TrendingUp size={20} />} index={1} />
        <StatCard label="Converted" value={stats.converted} icon={<TrendingUp size={20} />} index={2} />
      </div>

      <DataTable<Match>
        columns={columns}
        data={matches}
        loading={loading}
        rowKey="id"
      />
    </div>
  )
}
