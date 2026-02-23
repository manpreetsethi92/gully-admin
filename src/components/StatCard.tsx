import { TrendingUp, TrendingDown } from 'lucide-react'
import { ReactNode } from 'react'
import { getStatColor } from '../utils/colors'

interface Props {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: number
  index?: number
  color?: string
}

export default function StatCard({ label, value, icon, trend, index = 0, color }: Props) {
  const bgColor = color || getStatColor(index)
  const isTrendingUp = trend !== undefined && trend > 0

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${bgColor} border backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${isTrendingUp ? 'text-green-400' : 'text-red-400'}`}>
            {isTrendingUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
