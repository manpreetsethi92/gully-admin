import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, FileText, Zap, Users, Target, Link as LinkIcon, 
  MessageSquare, TrendingUp, ActivitySquare, ChevronLeft, X,
  Bot, Send, Handshake, Briefcase, BarChart2, Star, MapPin, DollarSign
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/' },
  { id: 'wa-jobs', label: 'WA Group Jobs', icon: Zap, href: '/wa-jobs' },
  { id: 'jobs', label: 'Job Pipeline', icon: FileText, href: '/jobs' },
  { id: 'requests', label: 'Requests', icon: Target, href: '/requests' },
  { id: 'matches', label: 'Matches', icon: LinkIcon, href: '/matches' },
  { id: 'connections', label: 'Connections', icon: Handshake, href: '/connections' },
  { id: 'opportunities', label: 'Opportunities', icon: Briefcase, href: '/opportunities' },
  { id: 'users', label: 'Users', icon: Users, href: '/users' },
  { id: 'outreach', label: 'Outreach Queue', icon: Send, href: '/outreach' },
  { id: 'messaging', label: 'Messaging', icon: MessageSquare, href: '/messaging' },
  { id: 'ai-costs', label: 'AI Costs', icon: Bot, href: '/ai-costs' },
  { id: 'match-analytics', label: 'Match Analytics', icon: BarChart2, href: '/match-analytics' },
  { id: 'success-stories', label: 'Success Stories', icon: Star, href: '/success-stories' },
  { id: 'category-coverage', label: 'Category Coverage', icon: MapPin, href: '/category-coverage' },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, href: '/revenue' },
  { id: 'growth', label: 'Growth', icon: TrendingUp, href: '/growth' },
  { id: 'activity', label: 'Activity', icon: ActivitySquare, href: '/activity' },
]

interface SidebarProps {
  open: boolean
  onToggle: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ open, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation()
  const handleNavClick = () => {
    if (mobileOpen && onMobileClose) onMobileClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onMobileClose} />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-dark-surface border-r border-dark-border
        transition-all duration-300 z-50
        ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
        md:translate-x-0 md:relative md:z-0
        ${open ? 'md:w-64' : 'md:w-20'}
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Zap size={24} className="text-accent" />
            </div>
            {(open || mobileOpen) && <div className="font-bold text-lg">GIGGY</div>}
          </div>
          <button onClick={onMobileClose} className="md:hidden p-2 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>
          <button onClick={onToggle} className="hidden md:block p-2 hover:bg-white/10 rounded-lg">
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
                onClick={handleNavClick}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-accent/20 text-accent border border-accent/30' 
                    : 'text-gray-300 hover:bg-white/5'
                  }
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                {(open || mobileOpen) && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border">
          <div className={`text-xs text-gray-500 ${(open || mobileOpen) ? '' : 'text-center'}`}>
            {(open || mobileOpen) ? 'Giggy Admin' : 'v1'}
          </div>
        </div>
      </aside>
    </>
  )
}