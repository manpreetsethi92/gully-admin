import { formatDistanceToNow, format } from 'date-fns'

export const formatDate = (date: string | Date) => {
  if (!date) return '—'
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatTime = (date: string | Date) => {
  if (!date) return '—'
  return format(new Date(date), 'HH:mm')
}

export const formatDateTime = (date: string | Date) => {
  if (!date) return '—'
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const formatRelativeTime = (date: string | Date) => {
  if (!date) return '—'
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return '—'
  }
}

export const formatPhone = (phone?: string) => {
  if (!phone) return '—'
  // Ensure +91 format for Indian numbers
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 10) return `+91${clean}`
  if (clean.length === 12 && clean.startsWith('91')) return `+${clean}`
  if (phone.startsWith('+')) return phone
  return `+91${clean}`
}

export const formatCurrency = (amount?: number | string) => {
  if (!amount && amount !== 0) return '—'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '—'
  return `$${num.toFixed(2)}`
}

export const formatNumber = (num?: number) => {
  if (num === undefined || num === null) return '—'
  return num.toLocaleString()
}

export const formatPercent = (num?: number) => {
  if (num === undefined || num === null) return '—'
  return `${Math.round(num)}%`
}

export const truncate = (text: string, length: number = 100) => {
  if (!text) return ''
  return text.length > length ? `${text.substring(0, length)}...` : text
}
