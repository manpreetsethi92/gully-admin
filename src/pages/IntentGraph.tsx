import { useEffect, useState } from 'react'
import { Network, Zap, Link as LinkIcon } from 'lucide-react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { fetchIntentGraphNodes, fetchCollabEdges, fetchMicroTeams, fetchSkillAffinity, fetchTrustPropagation } from '../utils/api'

interface IntentNode {
  id: string
  user_id: string
  user_name: string
  skill: string
  cis_score: number
  intent_type: string
  timestamp: string
}

interface CollabEdge {
  from_user_id: string
  from_user_name: string
  to_user_id: string
  to_user_name: string
  collaboration_count: number
  cis_value: number
  shared_skills: string[]
}

interface MicroTeam {
  id: string
  name: string
  members: number
  primary_skill: string
  avg_cis: number
  active: boolean
}

interface SkillAffinityData {
  user_id: string
  user_name: string
  skill: string
  proficiency: number
  affinity_score: number
}

interface TrustVouch {
  vouch_id: string
  from_user: string
  to_user: string
  score: number
  timestamp: string
}

export default function IntentGraph() {
  const [nodes, setNodes] = useState<IntentNode[]>([])
  const [edges, setEdges] = useState<CollabEdge[]>([])
  const [teams, setTeams] = useState<MicroTeam[]>([])
  const [skillAffinity, setSkillAffinity] = useState<SkillAffinityData[]>([])
  const [trustChain, setTrustChain] = useState<TrustVouch[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'nodes' | 'edges' | 'teams' | 'skills' | 'trust'>('nodes')
  const [stats, setStats] = useState({ totalNodes: 0, totalEdges: 0, avgCIS: 0 })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [nodesData, edgesData, teamsData, skillData, trustData] = await Promise.all([
        fetchIntentGraphNodes(),
        fetchCollabEdges(),
        fetchMicroTeams(),
        fetchSkillAffinity(),
        fetchTrustPropagation(),
      ])

      const processedNodes = Array.isArray(nodesData.nodes) ? nodesData.nodes : []
      const processedEdges = Array.isArray(edgesData.edges) ? edgesData.edges : []
      const processedTeams = Array.isArray(teamsData.teams) ? teamsData.teams : []
      const processedSkills = Array.isArray(skillData.affinity) ? skillData.affinity : []
      const processedTrust = Array.isArray(trustData.vouches) ? trustData.vouches : []

      setNodes(processedNodes)
      setEdges(processedEdges)
      setTeams(processedTeams)
      setSkillAffinity(processedSkills)
      setTrustChain(processedTrust)

      const avgCIS =
        processedNodes.length > 0
          ? processedNodes.reduce((sum: number, n: IntentNode) => sum + n.cis_score, 0) / processedNodes.length
          : 0

      setStats({
        totalNodes: processedNodes.length,
        totalEdges: processedEdges.length,
        avgCIS: parseFloat(avgCIS.toFixed(2)),
      })
    } catch (error) {
      console.error('Failed to load intent graph data:', error)
    } finally {
      setLoading(false)
    }
  }

  const nodeColumns = [
    { key: 'user_name' as const, label: 'User', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'skill' as const, label: 'Skill', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">{val}</span> },
    { key: 'intent_type' as const, label: 'Intent Type', render: (val: string) => <span className="text-sm">{val}</span> },
    { key: 'cis_score' as const, label: 'CIS Score', render: (val: number) => <span className="font-semibold">{val.toFixed(2)}</span> },
    { key: 'timestamp' as const, label: 'Updated', render: (val: string) => <span className="text-sm text-gray-400">{new Date(val).toLocaleDateString()}</span> },
  ]

  const edgeColumns = [
    { key: 'from_user_name' as const, label: 'From', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'to_user_name' as const, label: 'To', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'collaboration_count' as const, label: 'Collaborations', render: (val: number) => <span className="text-center">{val}</span> },
    { key: 'cis_value' as const, label: 'CIS Value', render: (val: number) => <span className="font-semibold text-accent">{val.toFixed(3)}</span> },
    { key: 'shared_skills' as const, label: 'Skills', render: (val: string[]) => <span className="text-xs">{val.join(', ') || '—'}</span> },
  ]

  const teamColumns = [
    { key: 'name' as const, label: 'Team Name', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'members' as const, label: 'Members', render: (val: number) => <span>{val}</span> },
    { key: 'primary_skill' as const, label: 'Skill', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">{val}</span> },
    { key: 'avg_cis' as const, label: 'Avg CIS', render: (val: number) => <span className="font-semibold">{val.toFixed(2)}</span> },
    { key: 'active' as const, label: 'Status', render: (val: boolean) => <span className={`text-xs ${val ? 'text-green-400' : 'text-gray-500'}`}>{val ? '✓ Active' : 'Inactive'}</span> },
  ]

  const skillColumns = [
    { key: 'user_name' as const, label: 'User', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'skill' as const, label: 'Skill', render: (val: string) => <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">{val}</span> },
    { key: 'proficiency' as const, label: 'Proficiency', render: (val: number) => <span>{(val * 100).toFixed(0)}%</span> },
    { key: 'affinity_score' as const, label: 'Affinity', render: (val: number) => <span className="font-semibold">{val.toFixed(2)}</span> },
  ]

  const trustColumns = [
    { key: 'from_user' as const, label: 'From', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'to_user' as const, label: 'To', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'score' as const, label: 'Trust Score', render: (val: number) => <span className="font-semibold text-green-400">{val.toFixed(2)}</span> },
    { key: 'timestamp' as const, label: 'Vouched', render: (val: string) => <span className="text-sm text-gray-400">{new Date(val).toLocaleDateString()}</span> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Intent Graph</h1>
        <p className="text-gray-400 text-sm mt-1">Collaboration networks, skills, and trust propagation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Nodes" value={stats.totalNodes} icon={<Network size={20} />} index={0} />
        <StatCard label="Collaboration Edges" value={stats.totalEdges} icon={<LinkIcon size={20} />} index={1} />
        <StatCard label="Avg CIS Score" value={stats.avgCIS.toFixed(2)} icon={<Zap size={20} />} index={2} />
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg">
        <div className="border-b border-dark-border p-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('nodes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'nodes' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Intent Nodes
          </button>
          <button
            onClick={() => setActiveTab('edges')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'edges' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Collaboration Edges
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'teams' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Micro Teams
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'skills' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Skill Affinity
          </button>
          <button
            onClick={() => setActiveTab('trust')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'trust' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Trust Chain
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'nodes' && <DataTable<IntentNode> columns={nodeColumns} data={nodes} loading={loading} rowKey="id" />}
          {activeTab === 'edges' && <DataTable<CollabEdge> columns={edgeColumns} data={edges} loading={loading} rowKey="from_user_id" />}
          {activeTab === 'teams' && <DataTable<MicroTeam> columns={teamColumns} data={teams} loading={loading} rowKey="id" />}
          {activeTab === 'skills' && <DataTable<SkillAffinityData> columns={skillColumns} data={skillAffinity} loading={loading} rowKey="user_id" />}
          {activeTab === 'trust' && <DataTable<TrustVouch> columns={trustColumns} data={trustChain} loading={loading} rowKey="vouch_id" />}
        </div>
      </div>
    </div>
  )
}