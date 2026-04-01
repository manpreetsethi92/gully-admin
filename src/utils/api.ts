import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.trygully.com/api'
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'gully-admin-secret-123'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'x-admin-secret': ADMIN_SECRET,
  },
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

export const fetchRequests = async (limit = 200, page = 1) => {
  const response = await api.get(`/admin/dashboard/requests?limit=${limit}&page=${page}`)
  return response.data
}
export const fetchMatches = async (limit = 500) => {
  const response = await api.get(`/admin/matches?limit=${limit}`)
  return response.data
}

export const fetchUsers = async (limit = 200, page = 1) => {
  const response = await api.get(`/admin/dashboard/users?limit=${limit}&page=${page}`)
  return response.data
}

export const fetchUserDetail = async (userId: string) => {
  const response = await api.get(`/admin/dashboard/users/${userId}`)
  return response.data
}

export const fetchFabricUser = async (userId: string) => {
  // Get fabric enrichment data for a user
  const response = await api.get(`/admin/dashboard/users/${userId}/fabric`)
  return response.data
}


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

// Ads & Campaigns (placeholder stubs for future features)
export const fetchActiveCampaigns = async () => {
  return { campaigns: [], total: 0 }
}

export const fetchCampaignPerformance = async () => {
  return { metrics: [] }
}

export const fetchAdRevenueDashboard = async () => {
  return { revenue: null }
}

export const fetchGigAdvances = async () => {
  return { advances: [], total_amount: 0 }
}

export const fetchAdvanceRepayment = async () => {
  return { repayments: [], total_repaid: 0 }
}

// Demand Forecasting (placeholder stubs)
export const fetchDemandForecast = async () => {
  return { forecasts: [], accuracy: 0 }
}

export const fetchSeasonalTrends = async () => {
  return { trends: [] }
}

export const fetchForecastAccuracy = async () => {
  return { accuracy: [] }
}

// Enterprise API (placeholder stubs)
export const fetchAPIKeys = async () => {
  return { keys: [] }
}

export const fetchEnterpriseClients = async () => {
  return { clients: [] }
}

export const fetchAPIUsageBilling = async () => {
  return { usage: [], billing: [] }
}

// Intent Graph (placeholder stubs)
export const fetchIntentGraphNodes = async () => {
  return { nodes: [] }
}

export const fetchCollabEdges = async () => {
  return { edges: [] }
}

export const fetchMicroTeams = async () => {
  return { teams: [] }
}

export const fetchSkillAffinity = async () => {
  return { affinity: [] }
}

export const fetchTrustPropagation = async () => {
  return { vouches: [] }
}

// Rate Benchmarks (placeholder stubs)
export const fetchRateBenchmarks = async () => {
  return { benchmarks: [] }
}

export const fetchRateTrends = async () => {
  return { trends: [] }
}

export const fetchBenchmarkAccuracy = async () => {
  return { accuracy: [] }
}

// Social Listening (placeholder stubs)
export const fetchLiveSignalFeed = async () => {
  return { signals: [] }
}

export const fetchSignalConversionRate = async () => {
  return { metrics: null }
}

export const fetchSignalConfidence = async () => {
  return { distribution: [] }
}

export const fetchUnfilledSignals = async () => {
  return { unfilled: [] }
}

export default api