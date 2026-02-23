import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { Zap, Users, Target, TrendingUp, Eye } from 'lucide-react'
import { fetchWAGroupJobs } from '../utils/api'
import { WAGroupJob } from '../types'
import { formatDate, formatPhone, truncate, formatRelativeTime } from '../utils/format'
import { getStatusColor, getUrgencyColor } from '../utils/colors'

export default function WAGroupJobs() {
  const [jobs, setJobs] = useState<WAGroupJob[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<WAGroupJob | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterGroup, setFilterGroup] = useState<string>('')

  useEffect(() => {
    loadJobs()
  }, [filterStatus, filterGroup])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const data = await fetchWAGroupJobs({
        status: filterStatus || undefined,
        group_name: filterGroup || undefined,
        limit: 100,
      })
      setJobs(Array.isArray(data.jobs) ? data.jobs : data)
    } catch (error) {
      console.error('Failed to load WA jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: jobs.length,
    today: jobs.filter(j => new Date(j.created_at) > new Date(Date.now() - 24*60*60*1000)).length,
    groups: new Set(jobs.map(j => j.group_name)).size,
    matched: jobs.filter(j => j.status === 'matched').length,
  }

  const columns = [
    {
      key: 'title' as const,
      label: 'Job Title',
      render: (val: string) => <span className="font-medium">{truncate(val, 50)}</span>,
    },
    {
      key: 'group_name' as const,
      label: 'Group',
      render: (val: string) => <span className="text-sm text-gray-400">{truncate(val, 30)}</span>,
    },
    {
      key: 'location' as const,
      label: 'Location',
      render: (val: string) => <span className="text-sm">{val || '—'}</span>,
    },
    {
      key: 'contact' as const,
      label: 'Contact',
      render: (val: any) => <span className="text-sm">{val?.phone ? formatPhone(val.phone) : '—'}</span>,
    },
    {
      key: 'matches_count' as const,
      label: 'Matches',
      render: (val: number) => <span className="font-semibold">{val}</span>,
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (val: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(val)}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'created_at' as const,
      label: 'Created',
      render: (val: string) => <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span>,
      sortable: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">WhatsApp Group Jobs</h1>
        <p className="text-gray-400 text-sm mt-1">Manage jobs ingested from WhatsApp groups</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs" value={stats.total} icon={<Zap size={20} />} index={0} />
        <StatCard label="Today" value={stats.today} icon={<Target size={20} />} index={1} />
        <StatCard label="Active Groups" value={stats.groups} icon={<Users size={20} />} index={2} />
        <StatCard label="Matched" value={stats.matched} icon={<TrendingUp size={20} />} index={3} />
      </div>

      {/* Filters */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4 flex gap-4 flex-wrap">
        <div>
          <label className="text-sm text-gray-400 block mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="matched">Matched</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400 block mb-2">Group</label>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm"
          >
            <option value="">All Groups</option>
            {Array.from(new Set(jobs.map(j => j.group_name))).map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden">
        <DataTable<WAGroupJob>
          columns={columns}
          data={jobs}
          loading={loading}
          rowKey="id"
          onRowClick={(job) => {
            setSelectedJob(job)
            setShowModal(true)
          }}
        />
      </div>

      {/* Detail Modal */}
      {showModal && selectedJob && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-dark-surface border border-dark-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedJob.title}</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Description</h3>
                <p className="text-gray-300">{selectedJob.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Location</h3>
                  <p>{selectedJob.location}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Budget</h3>
                  <p>{selectedJob.budget || '—'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Status</h3>
                  <span className={`px-3 py-1 rounded text-sm font-medium border ${getStatusColor(selectedJob.status)}`}>
                    {selectedJob.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Urgency</h3>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getUrgencyColor(selectedJob.urgency)}`}>
                    {selectedJob.urgency}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 mb-2">Contact Info</h3>
                <div className="bg-dark-bg p-3 rounded text-sm space-y-1">
                  <p><span className="text-gray-400">Name:</span> {selectedJob.contact?.name || '—'}</p>
                  <p><span className="text-gray-400">Phone:</span> {formatPhone(selectedJob.contact?.phone)}</p>
                  <p><span className="text-gray-400">Email:</span> {selectedJob.contact?.email || '—'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 mb-2">Roles Needed ({selectedJob.roles_needed.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.roles_needed.map((role, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                      {role.role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-dark-border">
                <button className="flex-1 px-4 py-2 bg-accent rounded-lg text-white font-medium hover:opacity-90">
                  Trigger Matching
                </button>
                <button className="flex-1 px-4 py-2 border border-dark-border rounded-lg hover:bg-white/5">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
