import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { CheckCircle, AlertCircle, Users, TrendingUp, Send } from 'lucide-react'
import { fetchBlastStats, fetchBlastToday } from '../utils/api'
import { formatRelativeTime, formatPhone } from '../utils/format'

interface BlastStats {
  total_sent: number
  signed_up: number
  not_signed_up: number
  conversion_rate: number
  recent_blasts: Array<{ phone: string; name?: string; sent_at: string; signed_up: boolean }>
}

interface BlastToday {
  users: Array<{ phone: string; name?: string; status?: string }>
  outreach: Array<{ phone: string; sent_at?: string; status?: string }>
  total: number
}

export default function Messaging() {
  const [blastStats, setBlastStats] = useState<BlastStats | null>(null)
  const [todayData, setTodayData] = useState<BlastToday | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, todayRes] = await Promise.all([fetchBlastStats(), fetchBlastToday()])
        setBlastStats(statsRes)
        setTodayData(todayRes)
      } catch (err) {
        console.error('Failed to load messaging data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading messaging data...</div>

  const stats = blastStats || { total_sent: 0, signed_up: 0, not_signed_up: 0, conversion_rate: 0, recent_blasts: [] }

  const recentColumns = [
    { key: 'phone' as const, label: 'Phone', render: (val: string) => <span className="text-sm font-mono">{formatPhone(val)}</span> },
    { key: 'name' as const, label: 'Name', render: (val?: string) => <span className="text-sm">{val || '—'}</span> },
    { key: 'signed_up' as const, label: 'Converted', render: (val: boolean) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${val ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
        {val ? 'Yes' : 'No'}
      </span>
    ) },
    { key: 'sent_at' as const, label: 'Sent', render: (val: string) => <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messaging</h1>
        <p className="text-gray-400 text-sm mt-1">WhatsApp blast outreach and conversion tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="Total Sent" value={stats.total_sent} icon={<Send size={20} />} index={0} />
        <StatCard label="Signed Up" value={stats.signed_up} icon={<CheckCircle size={20} />} index={1} />
        <StatCard label="Not Signed Up" value={stats.not_signed_up} icon={<AlertCircle size={20} />} index={4} />
        <StatCard label="Conversion Rate" value={`${stats.conversion_rate}%`} icon={<TrendingUp size={20} />} index={2} />
        <StatCard label="Today's Outreach" value={todayData?.total || 0} icon={<Users size={20} />} index={3} />
      </div>
      {/* Recent Blasts Table */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Blasts</h2>
        {stats.recent_blasts.length > 0 ? (
          <DataTable
            columns={recentColumns}
            data={stats.recent_blasts}
            loading={false}
            rowKey="phone"
          />
        ) : (
          <p className="text-gray-500 text-center py-4">No blast history yet</p>
        )}
      </div>

      {/* Channel Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Channel Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">WhatsApp Business API</span>
              <span className="text-green-400">● Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Twilio</span>
              <span className="text-green-400">● Active</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Today's Outreach</h2>
          {todayData && todayData.outreach.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todayData.outreach.map((o, idx) => (
                <div key={idx} className="flex justify-between text-sm p-2 rounded bg-dark-bg">
                  <span className="font-mono">{formatPhone(o.phone)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${o.status === 'sent' ? 'text-green-400' : 'text-gray-400'}`}>{o.status || 'queued'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No outreach today</p>
          )}
        </div>
      </div>
    </div>
  )
}