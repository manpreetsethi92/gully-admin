export const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'new':
    case 'pending':
    case 'notified':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'matched':
    case 'converted':
    case 'completed':
    case 'success':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'expired':
    case 'declined':
    case 'failed':
    case 'error':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'ghosted':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    default:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  }
}

export const getUrgencyColor = (urgency?: string) => {
  switch (urgency?.toLowerCase()) {
    case 'high':
      return 'bg-red-500/20 text-red-400'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'low':
      return 'bg-green-500/20 text-green-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

export const getSourceColor = (source?: string) => {
  const s = source?.toLowerCase() || ''
  if (s.includes('reddit')) return 'bg-orange-500/20 text-orange-400'
  if (s.includes('twitter')) return 'bg-blue-500/20 text-blue-400'
  if (s.includes('craigslist')) return 'bg-purple-500/20 text-purple-400'
  if (s.includes('whatsapp') || s.includes('wa')) return 'bg-green-500/20 text-green-400'
  return 'bg-gray-500/20 text-gray-400'
}

export const getStatColor = (index: number) => {
  const colors = [
    'from-blue-500/20 to-blue-600/5 border-blue-500/30',
    'from-green-500/20 to-green-600/5 border-green-500/30',
    'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
    'from-orange-500/20 to-orange-600/5 border-orange-500/30',
    'from-red-500/20 to-red-600/5 border-red-500/30',
    'from-purple-500/20 to-purple-600/5 border-purple-500/30',
    'from-pink-500/20 to-pink-600/5 border-pink-500/30',
    'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
  ]
  return colors[index % colors.length]
}
