import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'https://titly-backend-production.up.railway.app/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export const fetchDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/overview')
  return response.data
}

export const fetchWAGroupJobs = async (filters?: any) => {
  const params = new URLSearchParams()
  if (filters?.status) params.append('status', filters.status)
  if (filters?.group_name) params.append('group_name', filters.group_name)
  if (filters?.limit) params.append('limit', filters.limit)
  if (filters?.skip) params.append('skip', filters.skip)
  const response = await api.get(`/wa-group/jobs?${params}`)
  return response.data
}

export const fetchRequests = async (limit = 50, skip = 0) => {
  const response = await api.get(`/admin/dashboard/requests?limit=${limit}&skip=${skip}`)
  return response.data
}
export const fetchMatches = async (limit = 50, skip = 0) => {
  const response = await api.get(`/admin/matches?limit=${limit}&skip=${skip}`)
  return response.data
}

export const fetchUsers = async (limit = 50, skip = 0) => {
  const response = await api.get(`/admin/dashboard/users?limit=${limit}&skip=${skip}`)
  return response.data
}

export const fetchGrowthDaily = async () => {
  const response = await api.get('/admin/analytics/growth')
  return response.data
}

export const fetchFunnel = async () => {
  const response = await api.get('/admin/analytics/funnel')
  return response.data
}

export const fetchJobQueueStats = async () => {
  const response = await api.get('/admin/job-queue/stats')
  return response.data
}

export const fetchBlastStats = async () => {
  const response = await api.get('/admin/blast/stats')
  return response.data
}

export const fetchBlastToday = async () => {
  const response = await api.get('/admin/blast/today')
  return response.data
}
export const fetchActivityLog = async (limit = 50) => {
  const response = await api.get(`/admin/activity?limit=${limit}`)
  return response.data
}

export const triggerWAJobMatching = async (jobId: string) => {
  const response = await api.post(`/wa-group/jobs/${jobId}/match`)
  return response.data
}

export const fetchAICosts = async (days = 30) => {
  const response = await api.get(`/admin/dashboard/ai-costs?days=${days}`)
  return response.data
}

export const fetchOutreachDashboard = async () => {
  const response = await api.get('/passive/outreach-dashboard')
  return response.data
}

export const markOutreachSent = async (outreachId: string) => {
  const response = await api.post(`/passive/outreach/${outreachId}/mark-sent`)
  return response.data
}

export const markOutreachReplied = async (outreachId: string) => {
  const response = await api.post(`/passive/outreach/${outreachId}/mark-replied`)
  return response.data
}

export const fetchConnections = async (limit = 50) => {
  const response = await api.get(`/admin/dashboard/connections?limit=${limit}`)
  return response.data
}

export const fetchOpportunities = async (limit = 50) => {
  const response = await api.get(`/admin/dashboard/opportunities?limit=${limit}`)
  return response.data
}

export const fetchBlastContacts = async (limit = 1000) => {
  const response = await api.get(`/admin/blast/contacts?limit=${limit}`)
  return response.data
}

export const sendBlastMessages = async (phones: string[], message: string) => {
  const response = await api.post('/admin/blast/send', { phones, message })
  return response.data
}

export const fetchHealthStatus = async () => {
  const response = await api.get('/admin/dashboard/health')
  return response.data
}

export const fetchSuccessStories = async () => {
  const response = await api.get('/admin/success-stories')
  return response.data
}

export const approveSuccessStory = async (matchId: string) => {
  const response = await api.post(`/admin/success-stories/${matchId}/approve`)
  return response.data
}

export const fetchCategoryCoverage = async () => {
  const response = await api.get('/admin/category-coverage')
  return response.data
}

export const fetchRevenueAttribution = async () => {
  const response = await api.get('/admin/revenue-attribution')
  return response.data
}

export default api