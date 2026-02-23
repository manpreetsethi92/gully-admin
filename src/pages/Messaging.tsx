import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'

export default function Messaging() {
  const [stats, setStats] = useState({
    sent_today: 0,
    failed_today: 0,
    success_rate: 0,
    whatsapp_users: 0,
    telegram_users: 0,
  })

  useEffect(() => {
    // TODO: Load messaging stats
  }, [])

  const successRate = stats.sent_today > 0 
    ? Math.round(((stats.sent_today - stats.failed_today) / stats.sent_today) * 100)
    : 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messaging</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor message delivery and platform communication</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="Sent Today" value={stats.sent_today} icon={<MessageSquare size={20} />} index={0} />
        <StatCard label="Failed" value={stats.failed_today} icon={<AlertCircle size={20} />} index={1} />
        <StatCard label="Success Rate" value={`${successRate}%`} icon={<CheckCircle size={20} />} index={2} />
        <StatCard label="WhatsApp" value={stats.whatsapp_users} index={3} />
        <StatCard label="Telegram" value={stats.telegram_users} index={4} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Channel Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">WhatsApp</span>
              <span className="text-green-400">● Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Telegram</span>
              <span className="text-green-400">● Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-400 text-sm">Message activity feed coming soon...</p>
        </div>
      </div>
    </div>
  )
}
