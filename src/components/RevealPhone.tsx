import { useEffect, useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { revealPhone, type PhoneKind } from '../utils/api'

// How long a revealed number stays on screen before it masks itself again. Long
// enough to read it out or copy it; short enough that a screen left open does not
// keep someone's number on display.
const REVEAL_SECONDS = 30

interface Props {
  /** The masked value the API returned, e.g. "+•••••••6680". */
  masked?: string | null
  kind: PhoneKind
  /** The id the reveal endpoint looks the number up by. */
  refId?: string | null
  className?: string
}

/**
 * Shows a masked phone with a "Show" control that fetches the full number from
 * the audited reveal endpoint. Every click is logged server-side and capped per
 * hour, so the full list cannot be pulled one number at a time.
 */
export default function RevealPhone({ masked, kind, refId, className = '' }: Props) {
  const [full, setFull] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!full) return
    const t = setTimeout(() => setFull(null), REVEAL_SECONDS * 1000)
    return () => clearTimeout(t)
  }, [full])

  if (!masked) return <span className={className}>—</span>

  const toggle = async (e: React.MouseEvent) => {
    // These sit inside clickable table rows; revealing must not also open the row.
    e.stopPropagation()
    if (full) { setFull(null); return }
    if (!refId) return
    setBusy(true)
    setError(null)
    try {
      setFull(await revealPhone(kind, refId))
    } catch (err: any) {
      const status = err?.response?.status
      setError(status === 429 ? 'Reveal limit reached'
        : status === 404 ? 'No number on file'
        : 'Could not load')
    } finally {
      setBusy(false)
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={full ? 'font-mono text-white' : 'font-mono'}>{full || masked}</span>
      {refId && (
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          aria-label={full ? 'Hide phone number' : 'Show full phone number'}
          title={full ? 'Hide' : `Show for ${REVEAL_SECONDS}s (logged)`}
          className="text-gray-500 hover:text-white disabled:opacity-40 focus-visible:outline focus-visible:outline-1 rounded"
        >
          {busy ? <Loader2 size={12} className="animate-spin" />
            : full ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
      )}
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </span>
  )
}
