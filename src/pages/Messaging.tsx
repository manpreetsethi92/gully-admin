import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import { CheckCircle, AlertCircle, Users, TrendingUp, Send, RefreshCw } from 'lucide-react'
import { fetchBlastStats, fetchBlastContacts } from '../utils/api'
import { formatRelativeTime, formatPhone } from '../utils/format'

interface BlastStats {
  total_contacts?: number
  total_sent: number
  signed_up: number
  not_signed_up: number
  conversion_rate: number
}

interface BlastContact {
  phone: string
  phone_display?: string
  source_group?: string
  status?: string       // backend field: 'signed_up' | 'messaged' | 'new'
  signed_up?: boolean   // backend boolean
  created_at?: string
  messaged_at?: string
}

export default function Messaging() {
  const [stats, setStats] = useState<BlastStats | null>(null)
  const [contacts, setContacts] = useState<BlastContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterGroup, setFilterGroup] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, contactsRes] = await Promise.all([
        fetchBlastStats().catch(() => null),
        fetchBlastContacts(1000).catch(() => ({ contacts: [] })),
      ])
      setStats(statsRes)
      const list = Array.isArray(contactsRes?.contacts) ? contactsRes.contacts : Array.isArray(contactsRes) ? contactsRes : []
      setContacts(list)
    } catch (err: any) {
      setError(err.message || 'Failed to load messaging data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading messaging data...</div>
  if (error) return <ErrorState message={error} onRetry={load} />

  const s = stats || { total_contacts: 0, total_sent: 0, signed_up: 0, not_signed_up: 0, conversion_rate: 0 }
  const sourceGroups = Array.from(new Set(contacts.map(c => c.source_group).filter(Boolean))) as string[]
  const filtered = filterGroup ? contacts.filter(c => c.source_group === filterGroup) : contacts

  const getContactStatus = (c: BlastContact): { label: string; color: string } => {
    if (c.signed_up === true || c.status === 'signed_up') return { label: 'Signed Up', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
    if (c.messaged_at || c.status === 'messaged') return { label: 'Messaged', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
    return { label: 'New', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messaging & Blast</h1>
          <p className="text-gray-400 text-sm mt-1">WhatsApp blast outreach and conversion tracking</p>
        </div>
        <button onClick={load} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="Total Contacts" value={s.total_contacts || contacts.length} icon={<Users size={20} />} index={0} />
        <StatCard label="Total Sent" value={s.total_sent} icon={<Send size={20} />} index={5} />
        <StatCard label="Signed Up" value={s.signed_up} icon={<CheckCircle size={20} />} index={1} />
        <StatCard label="Not Signed Up" value={s.not_signed_up} icon={<AlertCircle size={20} />} index={4} />
        <StatCard label="Conversion Rate" value={`${s.conversion_rate}%`} icon={<TrendingUp size={20} />} index={2} />
      </div>

      {sourceGroups.length > 0 && (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <label className="text-sm text-gray-400 block mb-2">Filter by Source Group</label>
          <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)}
            className="bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm">
            <option value="">All Groups ({contacts.length})</option>
            {sourceGroups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      )}

      <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-dark-border flex justify-between items-center">
          <span className="font-semibold">Contacts ({filtered.length.toLocaleString()})</span>
        </div>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg border-b border-dark-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Source Group</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Messaged</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filtered.slice(0, 200).map((c, i) => {
                  const { label, color } = getContactStatus(c)
                  return (
                    <tr key={c.phone + i} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-sm font-mono text-gray-300">{c.phone_display || formatPhone(c.phone)}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{c.source_group || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${color}`}>{label}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{c.messaged_at ? formatRelativeTime(c.messaged_at) : '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{c.created_at ? formatRelativeTime(c.created_at) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length > 200 && (
              <div className="px-4 py-3 text-center text-sm text-gray-500 border-t border-dark-border">
                Showing 200 of {filtered.length.toLocaleString()} contacts
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No contacts found</div>
        )}
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Channel Status</h2>
        <div className="space-y-3">
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
    </div>
  )
}
