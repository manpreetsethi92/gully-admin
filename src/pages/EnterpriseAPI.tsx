import { useEffect, useState } from 'react'
import { Key, Building2, DollarSign, Copy } from 'lucide-react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { fetchAPIKeys, fetchEnterpriseClients, fetchAPIUsageBilling } from '../utils/api'

interface APIKey {
  key_id: string
  name: string
  key_preview: string
  client_name: string
  created_at: string
  last_used: string
  status: 'active' | 'revoked' | 'expired'
  permissions: string[]
}

interface EnterpriseClient {
  client_id: string
  company_name: string
  contact_email: string
  api_keys_count: number
  total_requests_month: number
  status: 'active' | 'inactive' | 'suspended'
  contract_value: number
  contract_end_date: string
}

interface APIUsageBilling {
  client_id: string
  company_name: string
  current_month_requests: number
  current_month_cost: number
  monthly_limit: number
  usage_percent: number
  billing_status: 'on_track' | 'at_limit' | 'exceeded'
  overage_charges: number
}

export default function EnterpriseAPI() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [clients, setClients] = useState<EnterpriseClient[]>([])
  const [usageBilling, setUsageBilling] = useState<APIUsageBilling[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'keys' | 'clients' | 'usage'>('keys')
  const [stats, setStats] = useState({ activeKeys: 0, totalClients: 0, totalRevenue: 0 })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [keysData, clientsData, usageData] = await Promise.all([
        fetchAPIKeys(),
        fetchEnterpriseClients(),
        fetchAPIUsageBilling(),
      ])

      const processedKeys = Array.isArray(keysData.keys) ? keysData.keys : []
      const processedClients = Array.isArray(clientsData.clients) ? clientsData.clients : []
      const processedUsage = Array.isArray(usageData.usage) ? usageData.usage : []

      setApiKeys(processedKeys)
      setClients(processedClients)
      setUsageBilling(processedUsage)

      const activeKeysCount = processedKeys.filter((k: APIKey) => k.status === 'active').length
      const totalRevenue = processedClients.reduce((sum: number, c: EnterpriseClient) => sum + c.contract_value, 0)

      setStats({
        activeKeys: activeKeysCount,
        totalClients: processedClients.length,
        totalRevenue,
      })
    } catch (error) {
      console.error('Failed to load enterprise API data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const keysColumns = [
    { key: 'name' as const, label: 'Name', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'client_name' as const, label: 'Client', render: (val: string) => <span className="text-sm text-gray-300">{val}</span> },
    { key: 'key_preview' as const, label: 'Key Preview', render: (val: string) => (
      <div className="flex items-center gap-2">
        <code className="text-xs bg-dark-bg px-2 py-1 rounded text-gray-400">{val}...</code>
        <button onClick={() => copyToClipboard(val)} className="p-1 hover:bg-white/10 rounded transition-colors">
          <Copy size={14} className="text-gray-400 hover:text-accent" />
        </button>
      </div>
    ) },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`text-xs px-2 py-1 rounded ${val === 'active' ? 'bg-green-400/20 text-green-400' : val === 'revoked' ? 'bg-red-400/20 text-red-400' : 'bg-gray-400/20 text-gray-400'}`}>
        {val.charAt(0).toUpperCase() + val.slice(1)}
      </span>
    ) },
    { key: 'last_used' as const, label: 'Last Used', render: (val: string) => <span className="text-sm text-gray-400">{new Date(val).toLocaleDateString()}</span> },
  ]

  const clientsColumns = [
    { key: 'company_name' as const, label: 'Company', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'contact_email' as const, label: 'Contact', render: (val: string) => <span className="text-sm text-gray-300">{val}</span> },
    { key: 'api_keys_count' as const, label: 'API Keys', render: (val: number) => <span className="text-center">{val}</span> },
    { key: 'total_requests_month' as const, label: 'Requests (Mo)', render: (val: number) => <span>{val.toLocaleString()}</span> },
    { key: 'contract_value' as const, label: 'Contract Value', render: (val: number) => <span className="font-semibold text-accent">${val.toLocaleString()}</span> },
    { key: 'status' as const, label: 'Status', render: (val: string) => (
      <span className={`text-xs px-2 py-1 rounded ${val === 'active' ? 'bg-green-400/20 text-green-400' : val === 'suspended' ? 'bg-red-400/20 text-red-400' : 'bg-gray-400/20 text-gray-400'}`}>
        {val.charAt(0).toUpperCase() + val.slice(1)}
      </span>
    ) },
  ]

  const usageColumns = [
    { key: 'company_name' as const, label: 'Company', render: (val: string) => <span className="font-medium">{val}</span> },
    { key: 'current_month_requests' as const, label: 'Requests', render: (val: number) => <span>{val.toLocaleString()}</span> },
    { key: 'monthly_limit' as const, label: 'Limit', render: (val: number) => <span className="text-gray-400">{val.toLocaleString()}</span> },
    { key: 'usage_percent' as const, label: 'Usage %', render: (val: number) => (
      <span className={`font-semibold ${val > 80 ? 'text-red-400' : val > 50 ? 'text-yellow-400' : 'text-green-400'}`}>{val.toFixed(1)}%</span>
    ) },
    { key: 'current_month_cost' as const, label: 'Cost', render: (val: number) => <span className="font-semibold">${val.toLocaleString()}</span> },
    { key: 'billing_status' as const, label: 'Billing', render: (val: string) => (
      <span className={`text-xs px-2 py-1 rounded ${val === 'on_track' ? 'bg-green-400/20 text-green-400' : val === 'at_limit' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-red-400/20 text-red-400'}`}>
        {val.replace('_', ' ').toUpperCase()}
      </span>
    ) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enterprise API</h1>
        <p className="text-gray-400 text-sm mt-1">API key management, client accounts, and usage billing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active API Keys" value={stats.activeKeys} icon={<Key size={20} />} index={0} />
        <StatCard label="Enterprise Clients" value={stats.totalClients} icon={<Building2 size={20} />} index={1} />
        <StatCard label="Total Contract Value" value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`} icon={<DollarSign size={20} />} index={2} />
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-lg">
        <div className="border-b border-dark-border p-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'keys' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'clients' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Enterprise Clients
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'usage' ? 'bg-accent text-black' : 'hover:bg-white/10 text-gray-300'}`}
          >
            Usage & Billing
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'keys' && <DataTable<APIKey> columns={keysColumns} data={apiKeys} loading={loading} rowKey="key_id" />}
          {activeTab === 'clients' && <DataTable<EnterpriseClient> columns={clientsColumns} data={clients} loading={loading} rowKey="client_id" />}
          {activeTab === 'usage' && <DataTable<APIUsageBilling> columns={usageColumns} data={usageBilling} loading={loading} rowKey="client_id" />}
        </div>
      </div>
    </div>
  )
}