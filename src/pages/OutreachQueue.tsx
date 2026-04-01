import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import { Send, Clock, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react'
import { fetchOutreachDashboard } from '../utils/api'
import { formatRelativeTime } from '../utils/format'

interface OutreachItem {
  id: string
  professional_name?: string
  professional_linkedin?: string
  requester_name?: string
  requester_phone?: string
  channel?: string
  status: string
  intro_message?: string
  created_at: string
}

interface OutreachData {
  pending_outreach: OutreachItem[]
  sent_outreach: OutreachItem[]
  pending_count: number
  sent_waiting: number
  total_replied: number
  converted: number
}

export default function OutreachQueue() {
  const [data, setData] = useState<OutreachData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'pending' | 'sent'>('pending')

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

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading outreach queue...</div>
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!data) return <ErrorState message="No outreach data available" onRetry={load} />

  const items = tab === 'pending' ? (data.pending_outreach || []) : (data.sent_outreach || [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outreach Queue</h1>
          <p className="text-gray-400 text-sm mt-1">LinkedIn outreach to passive professionals</p>
        </div>
        <button onClick={load} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Pending" value={data.pending_count} icon={<Clock size={20} />} index={2} />
        <StatCard label="Sent" value={data.sent_waiting} icon={<Send size={20} />} index={0} />
        <StatCard label="Replied" value={data.total_replied} icon={<CheckCircle size={20} />} index={1} />
        <StatCard label="Converted" value={data.converted} icon={<CheckCircle size={20} />} index={3} />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('pending')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === 'pending' ? 'bg-accent text-white' : 'bg-dark-surface text-gray-400 hover:text-white'}`}>
          Pending ({data.pending_count})
        </button>
        <button onClick={() => setTab('sent')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === 'sent' ? 'bg-accent text-white' : 'bg-dark-surface text-gray-400 hover:text-white'}`}>
          Sent ({data.sent_waiting})
        </button>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border text-gray-400 text-xs uppercase">
              <th className="text-left px-4 py-3">Professional</th>
              <th className="text-left px-4 py-3">Requester</th>
              <th className="text-left px-4 py-3">Channel</th>
              <th className="text-left px-4 py-3">Message</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">No items</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="border-b border-dark-border/50 hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.professional_name || '—'}</span>
                    {item.professional_linkedin && (
                      <a href={item.professional_linkedin} target="_blank" rel="noreferrer">
                        <ExternalLink size={12} className="text-blue-400" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400">{item.requester_name || '—'}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs capitalize">{item.channel || 'linkedin'}</span>
                </td>
                <td className="px-4 py-3 text-gray-300 max-w-xs">
                  <span className="truncate block">{item.intro_message?.slice(0, 60) || '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    item.status === 'replied' || item.status === 'converted' ? 'bg-green-500/20 text-green-400' :
                    item.status === 'sent' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{item.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{formatRelativeTime(item.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
