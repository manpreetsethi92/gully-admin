import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import WAGroupJobs from './pages/WAGroupJobs'
import JobPipeline from './pages/JobPipeline'
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
import Login from './pages/Login'

const SESSION_KEY = 'titlii_admin_auth'

function ProtectedLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <Layout onLogout={onLogout}>
      <Outlet />
    </Layout>
  )
}

function App() {
  const [authed, setAuthed] = useState(() => {
    const stored = sessionStorage.getItem(SESSION_KEY)
    return stored === 'true'
  })

  const handleLogin = () => {
    sessionStorage.setItem(SESSION_KEY, 'true')
    setAuthed(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
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
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
