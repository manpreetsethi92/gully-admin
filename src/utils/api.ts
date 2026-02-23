import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'https://titly-backend-production.up.railway.app/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export const fetchWAGroupJobs = async (filters?: any) => {
  const params = new URLSearchParams()
  if (filters?.status) params.append('status', filters.status)
  if (filters?.group_name) params.append('group_name', filters.group_name)
  if (filters?.limit) params.append('limit', filters.limit)
  if (filters?.skip) params.append('skip', filters.skip)
  
  const response = await api.get(`/wa-group/jobs?${params}`)
  return response.data
}

export const fetchDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/overview')
  return response.data
}

export const fetchRequests = async (limit = 50, skip = 0) => {
  const response = await api.get(`/admin/dashboard/requests?limit=${limit}&skip=${skip}`)
  return response.data
}

export const fetchMatches = async (limit = 50, skip = 0) => {
  const response = await api.get(`/admin/dashboard/matches?limit=${limit}&skip=${skip}`)
  return response.data
}

export const fetchUsers = async (limit = 50, skip = 0) => {
  const response = await api.get(`/admin/dashboard/users?limit=${limit}&skip=${skip}`)
  return response.data
}

export const fetchGrowthMetrics = async () => {
  const response = await api.get('/admin/dashboard/growth')
  return response.data
}

export const triggerWAJobMatching = async (jobId: string) => {
  const response = await api.post(`/wa-group/jobs/${jobId}/match`)
  return response.data
}

export default api
