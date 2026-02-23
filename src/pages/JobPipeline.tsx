import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { FileText, CheckCircle, AlertCircle, Zap } from 'lucide-react'

export default function JobPipeline() {
  const [stats, setStats] = useState({
    scraped_today: 0,
    passed_haiku: 0,
    processed: 0,
    notified: 0,
    queue_backlog: 0,
  })

  useEffect(() => {
    // TODO: Load job pipeline stats
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Pipeline</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor the job processing pipeline</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Scraped Today" value={stats.scraped_today} icon={<FileText size={20} />} index={0} />
        <StatCard label="Passed Haiku" value={stats.passed_haiku} icon={<CheckCircle size={20} />} index={1} />
        <StatCard label="Processed" value={stats.processed} icon={<Zap size={20} />} index={2} />
        <StatCard label="Notified" value={stats.notified} icon={<CheckCircle size={20} />} index={3} />
        <StatCard label="Queue Backlog" value={stats.queue_backlog} icon={<AlertCircle size={20} />} index={4} />
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Pipeline Stages</h2>
        <p className="text-gray-400">Job pipeline visualization coming soon...</p>
      </div>
    </div>
  )
}
