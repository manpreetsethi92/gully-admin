import { useEffect, useState } from 'react'
import { fetchSuccessStories, approveSuccessStory } from '../utils/api'
import { Star, CheckCircle, Clock, Award } from 'lucide-react'

interface Story {
  match_id: string
  professional_name: string
  rater_name: string
  rating: number
  category: string
  location: string
  flagged_at: string
  status: string
  published: boolean
}

interface StoriesData {
  total: number
  pending: number
  approved: number
  published: number
  stories: Story[]
}

export default function SuccessStories() {
  const [data, setData] = useState<StoriesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSuccessStories()
        setData(res)
      } catch (err) {
        console.error('Failed to load success stories:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleApprove = async (matchId: string) => {
    try {
      await approveSuccessStory(matchId)
      setData(prev => prev ? {
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
        stories: prev.stories.map(s => 
          s.match_id === matchId ? { ...s, status: 'approved' } : s
        )
      } : null)
    } catch (err) {
      console.error('Failed to approve:', err)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading success stories...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Success Stories</h1>
        <p className="text-gray-400 text-sm mt-1">4-5 star matches flagged for marketing use</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="text-gray-400 text-sm flex items-center gap-2"><Award size={16} /> Total</div>
          <div className="text-2xl font-bold mt-1">{data?.total || 0}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="text-yellow-400 text-sm flex items-center gap-2"><Clock size={16} /> Pending</div>
          <div className="text-2xl font-bold mt-1">{data?.pending || 0}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="text-green-400 text-sm flex items-center gap-2"><CheckCircle size={16} /> Approved</div>
          <div className="text-2xl font-bold mt-1">{data?.approved || 0}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="text-blue-400 text-sm flex items-center gap-2"><Star size={16} /> Published</div>
          <div className="text-2xl font-bold mt-1">{data?.published || 0}</div>
        </div>
      </div>

      {(!data?.stories || data.stories.length === 0) ? (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-8 text-center text-gray-400">
          No success stories yet. They'll appear here when users rate matches 4-5 stars.
        </div>
      ) : (
        <div className="space-y-3">
          {data.stories.map((story) => (
            <div key={story.match_id} className="bg-dark-surface border border-dark-border rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">{story.professional_name}</span>
                  <span className="text-yellow-400">{'⭐'.repeat(story.rating)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    story.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    story.status === 'published' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>{story.status}</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Rated by {story.rater_name} · {story.category || 'uncategorized'} · {story.location || 'unknown location'}
                </div>
                <div className="text-xs text-gray-500 mt-1">{new Date(story.flagged_at).toLocaleDateString()}</div>
              </div>
              {story.status === 'pending' && (
                <button onClick={() => handleApprove(story.match_id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm transition-colors">
                  Approve
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
