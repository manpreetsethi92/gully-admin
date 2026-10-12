import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import Layout from './components/Layout'
import { getAdminToken, clearAdminToken } from './utils/api'
import Dashboard from './pages/Dashboard'
import WAGroupJobs from './pages/WAGroupJobs'
import JobPipeline from './pages/JobPipeline'
import JobAlerts from './pages/JobAlerts'
import Requests from './pages/Requests'
import Matches from './pages/Matches'
import Users from './pages/Users'
import Messaging from './pages/Messaging'
import Growth from './pages/Growth'
import ActivityLog from './pages/ActivityLog'
import AICosts from './pages/AICosts'
import OutreachQueue from './pages/OutreachQueue'
import Connections from './pages/Connections'
import Opportunities from './pages/Opportunities'
import MatchAnalytics from './pages/MatchAnalytics'
import SuccessStories from './pages/SuccessStories'
import CategoryCoverage from './pages/CategoryCoverage'
import RevenueAttribution from './pages/RevenueAttribution'
import Login from './pages/Login'
import IntentGraph from './pages/IntentGraph'
import AdsCampaigns from './pages/AdsCampaigns'
import SocialListening from './pages/SocialListening'
import RateBenchmarks from './pages/RateBenchmarks'
import DemandForecasting from './pages/DemandForecasting'
import EnterpriseAPI from './pages/EnterpriseAPI'

// Session state is the token itself, held by utils/api. A separate boolean
// flag would let the UI think it is signed in after the token expired.


function hasLiveToken(token: string | null): boolean {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp !== 'number' || payload.exp * 1000 > Date.now()
  } catch {
    return false // not a JWT at all — e.g. a stale value from the old boolean flag
  }
}

function ProtectedLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <Layout onLogout={onLogout}>
      <Outlet />
    </Layout>
  )
}

function App() {
  // Signed in means "holds a token that has not expired". This used to compare
  // the stored value to the string 'true' — left over from the old boolean flag
  // when the session became a JWT — so every reload or deep link logged the admin
  // out. Expiry is read from the token so a dead one shows the login screen
  // instead of a dashboard full of 401s; the server still verifies every request.
  const [authed, setAuthed] = useState(() => hasLiveToken(getAdminToken()))

  const handleLogin = () => {
    // token was stored by adminLogin()
    setAuthed(true)
  }

  const handleLogout = () => {
    clearAdminToken()
    setAuthed(false)
  }

  if (!authed) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedLayout onLogout={handleLogout} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wa-jobs" element={<WAGroupJobs />} />
          <Route path="/jobs" element={<JobPipeline />} />
          <Route path="/job-alerts" element={<JobAlerts />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/users" element={<Users />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/activity" element={<ActivityLog />} />
          <Route path="/ai-costs" element={<AICosts />} />
          <Route path="/outreach" element={<OutreachQueue />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/match-analytics" element={<MatchAnalytics />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/category-coverage" element={<CategoryCoverage />} />
          <Route path="/revenue" element={<RevenueAttribution />} />
          <Route path="/intent-graph" element={<IntentGraph />} />
          <Route path="/ads" element={<AdsCampaigns />} />
          <Route path="/social-listening" element={<SocialListening />} />
          <Route path="/rate-benchmarks" element={<RateBenchmarks />} />
          <Route path="/demand-forecasting" element={<DemandForecasting />} />
          <Route path="/enterprise-api" element={<EnterpriseAPI />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
