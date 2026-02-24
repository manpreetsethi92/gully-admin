import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({ message = 'Failed to load data', onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle size={40} className="text-red-400 mb-4" />
      <p className="text-red-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg text-white hover:bg-accent/90 transition-colors"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  )
}
