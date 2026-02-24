import { Menu, RefreshCw, Search, LogOut } from 'lucide-react'
import { useState } from 'react'

interface Props {
  onMenuToggle: () => void
  onLogout: () => void
}

export default function TopBar({ onMenuToggle, onLogout }: Props) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  return (
    <header className="h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="md:hidden p-2 hover:bg-white/10 rounded">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 flex-1 max-w-md">
          <Search size={18} className="text-gray-500" />
          <input type="text" placeholder="Search..." className="bg-transparent border-0 outline-none text-sm w-full" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handleRefresh} className={`p-2 hover:bg-white/10 rounded-lg transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
          <RefreshCw size={20} />
        </button>
        <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}