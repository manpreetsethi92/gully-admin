import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout><Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wa-jobs" element={<WAGroupJobs />} />
          <Route path="/jobs" element={<JobPipeline />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/users" element={<Users />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/activity" element={<ActivityLog />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
