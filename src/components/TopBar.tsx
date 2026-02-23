import { Menu, RefreshCw, Search } from 'lucide-react'
import { useState } from 'react'

export default function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Trigger a refresh of data
    window.location.reload()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <header className="h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="md:hidden p-2 hover:bg-white/10 rounded">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 flex-1 max-w-md">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-0 outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleRefresh}
          className={`p-2 hover:bg-white/10 rounded-lg transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </header>
  )
}
