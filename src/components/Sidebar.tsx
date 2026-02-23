import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, FileText, Zap, Users, Target, Link as LinkIcon, 
  Globe, MessageSquare, TrendingUp, ActivitySquare, Send, ChevronLeft 
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/' },
  { id: 'wa-jobs', label: 'WA Group Jobs', icon: Zap, href: '/wa-jobs' },
  { id: 'jobs', label: 'Job Pipeline', icon: FileText, href: '/jobs' },
  { id: 'requests', label: 'Requests', icon: Target, href: '/requests' },
  { id: 'matches', label: 'Matches', icon: LinkIcon, href: '/matches' },
  { id: 'users', label: 'Users', icon: Users, href: '/users' },
  { id: 'messaging', label: 'Messaging', icon: MessageSquare, href: '/messaging' },
  { id: 'growth', label: 'Growth', icon: TrendingUp, href: '/growth' },
  { id: 'activity', label: 'Activity', icon: ActivitySquare, href: '/activity' },
]

export default function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const location = useLocation()

  return (
    <aside className={`
      fixed left-0 top-0 h-screen bg-dark-surface border-r border-dark-border
      transition-all duration-300 z-50 md:relative md:z-0
      ${open ? 'w-64' : 'w-20'}
    `}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Zap size={24} className="text-accent" />
          </div>
          {open && <div className="font-bold text-lg">TITLII</div>}
        </div>
        <button
          onClick={onToggle}
          className="hidden md:block p-2 hover:bg-white/10 rounded-lg"
        >
          <ChevronLeft size={20} className={`transition-transform ${!open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              to={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-accent/20 text-accent border border-accent/30' 
                  : 'text-gray-300 hover:bg-white/5'
                }
              `}
            >
              <Icon size={20} className="flex-shrink-0" />
              {open && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border">
        <div className={`text-xs text-gray-500 ${open ? '' : 'text-center'}`}>
          {open ? 'Titlii Admin' : 'v1'}
        </div>
      </div>
    </aside>
  )
}
