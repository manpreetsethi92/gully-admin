import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface LayoutProps {
  children: React.ReactNode
  onLogout: () => void
}

export default function Layout({ children, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-dark-bg text-white">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
