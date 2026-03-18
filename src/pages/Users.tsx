import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { Users as UsersIcon, CheckCircle, MapPin } from 'lucide-react'
import { fetchUsers } from '../utils/api'
import { User } from '../types'
import { formatRelativeTime } from '../utils/format'

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, active: 0, verified: 0 })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await fetchUsers(200, 1)
      const usrs = Array.isArray(data.users) ? data.users : data
      setUsers(usrs)
      setStats({
        total: usrs.length,
        active: usrs.length,
        verified: usrs.filter((u: User) => u.verification_level === 'verified').length,
      })
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'name' as const, label: 'Name', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'phone' as const, label: 'Phone', render: (val: string) => <span className="text-sm text-gray-400">{val}</span> },
    { key: 'location' as const, label: 'Location', render: (val?: string) => <span>{val || '—'}</span> },
    { key: 'profile_completed' as const, label: 'Profile', render: (val: boolean) => (
      <span className={`text-sm ${val ? 'text-green-400' : 'text-gray-500'}`}>{val ? '✓ Complete' : 'Incomplete'}</span>
    ) },
    { key: 'created_at' as const, label: 'Joined', render: (val: string) => <span className="text-sm text-gray-400">{formatRelativeTime(val)}</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-400 text-sm mt-1">Manage user accounts and profiles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={stats.total} icon={<UsersIcon size={20} />} index={0} />
        <StatCard label="Active" value={stats.active} icon={<CheckCircle size={20} />} index={1} />
        <StatCard label="Verified" value={stats.verified} icon={<MapPin size={20} />} index={2} />
      </div>

      <DataTable<User>
        columns={columns}
        data={users}
        loading={loading}
        rowKey="id"
      />
    </div>
  )
}
