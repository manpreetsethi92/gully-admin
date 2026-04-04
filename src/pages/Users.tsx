import { useEffect, useState, useCallback } from 'react'
import { ChevronRight, X, Github, Youtube, RefreshCw, Zap } from 'lucide-react'
import { fetchUsers, fetchUserDetail, fetchUserMesh } from '../utils/api'
import { formatRelativeTime } from '../utils/format'

interface User {
  id: string
  name: string
  phone: string
  location?: string
  bio?: string
  skills?: string[]
  profile_completed?: boolean
  verification_level?: string
  created_at: string
  social_links?: Record<string, string | null>
  social_oauth?: Record<string, any>
  linked_at?: Record<string, string>
  fabric_connected_platforms?: string[]
  enriched_profile?: any
  onboarding_method?: string
  whatsapp_connected?: boolean
  subscription_tier?: string
  photo_url?: string
}

interface UserDetail {
  user: User
  fabric: {
    fabric_user_id?: string
    platforms_connected: string[]
    last_synced_at?: string
    thread_count?: number
    linked_at: Record<string, string>
    fabric_connected_platforms: string[]
    fabric_niche?: string
    fabric_industry?: string
    fabric_experience_level?: string
    fabric_extracted_skills: string[]
    fabric_ig_username?: string
    fabric_ig_followers?: number
    fabric_ig_bio?: string
    fabric_ig_following_sample: string[]
    fabric_linkedin_headline?: string
    fabric_linkedin_skills: string[]
    fabric_linkedin_experience: any[]
    fabric_linkedin_connections?: number
    fabric_google_contacts: any[]
    fabric_enriched_at?: string
  }
  oauth: {
    github?: any
    youtube?: any
    platforms: string[]
  }
  enrichment: {
    enriched_profile?: any
    linkedin_enriched?: any
    hyper_profile?: any
    hyper_profile_sources: string[]
    hyper_profile_updated_at?: string
  }
  activity: {
    requests_count: number
    requests: any[]
    matches_count: number
    matches: any[]
    connections_count: number
    message_count: number
  }
  profile_sources: Record<string, string | null>
  notes: any[]
}

const PLATFORM_COLORS: Record<string, string> = {
  facebook: '#1877F2', tiktok: '#010101', google: '#4285F4',
  instagram: '#C13584', linkedin: '#0A66C2', pinterest: '#E60023',
}

const Badge = ({ label, color = 'gray' }: { label: string; color?: string }) => {
  const colors: Record<string, string> = {
    green: 'bg-green-500/20 text-green-300', blue: 'bg-blue-500/20 text-blue-300',
    yellow: 'bg-yellow-500/20 text-yellow-300', red: 'bg-red-500/20 text-red-300',
    gray: 'bg-white/10 text-white/60', purple: 'bg-purple-500/20 text-purple-300',
  }
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>{label}</span>
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">{title}</h3>
    <div className="bg-white/5 rounded-xl p-3 space-y-2">{children}</div>
  </div>
)

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-white/50 shrink-0 w-36">{label}</span>
    <span className="text-white text-right break-all">{value || <span className="text-white/20">—</span>}</span>
  </div>
)

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<UserDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [mesh, setMesh] = useState<any>(null)
  const [stats, setStats] = useState({ total: 0, verified: 0, fabric: 0, oauth: 0 })
  const [search, setSearch] = useState('')

  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchUsers(200, 1)
      const usrs: User[] = Array.isArray(data.users) ? data.users : data
      setUsers(usrs)
      setStats({
        total: usrs.length,
        verified: usrs.filter(u => u.verification_level && u.verification_level !== 'phone').length,
        fabric: usrs.filter(u => (u.fabric_connected_platforms || []).length > 0).length,
        oauth: usrs.filter(u => Object.keys(u.social_oauth || {}).length > 0).length,
      })
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  const openDetail = async (userId: string) => {
    setDetailLoading(true)
    setMesh(null)
    try {
      const data = await fetchUserDetail(userId)
      setSelected(data)
      // Load mesh in background — don't block the panel
      fetchUserMesh(userId).then(m => setMesh(m)).catch(() => {})
    } catch (e) { console.error(e) }
    finally { setDetailLoading(false) }
  }

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search) || u.location?.toLowerCase().includes(search.toLowerCase())
  )

  const platformBadge = (platform: string) => (
    <span key={platform} className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: PLATFORM_COLORS[platform] || '#888' }} title={platform} />
  )

  return (
    <div className="flex h-full gap-4">
      {/* LEFT: User List */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Users</h1>
            <p className="text-white/40 text-sm mt-0.5">All registered accounts and their data state</p>
          </div>
          <button onClick={loadUsers} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <RefreshCw size={16} className="text-white/60" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'OAuth Connected', value: stats.oauth, color: 'text-blue-400' },
            { label: 'Fabric Connected', value: stats.fabric, color: 'text-purple-400' },
            { label: 'Verified', value: stats.verified, color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-xl p-3">
              <p className="text-white/40 text-xs">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, phone, location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/20"
        />

        {/* Table */}
        <div className="bg-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase">
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Platforms</th>
                <th className="text-left px-4 py-3">Profile</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-white/30">Loading...</td></tr>
              ) : filtered.map(user => {
                const fabricPlatforms = user.fabric_connected_platforms || []
                const oauthPlatforms = Object.keys(user.social_oauth || {})
                const allPlatforms = [...new Set([...fabricPlatforms, ...oauthPlatforms])]
                return (
                  <tr
                    key={user.id}
                    onClick={() => openDetail(user.id)}
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.photo_url
                          ? <img src={user.photo_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                          : <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 font-bold text-sm">{user.name?.[0]?.toUpperCase()}</div>
                        }
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-white/40 text-xs">{user.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60">{user.location || '—'}</td>
                    <td className="px-4 py-3">
                      {allPlatforms.length > 0
                        ? <span className="flex items-center">{allPlatforms.map(platformBadge)}<span className="text-white/40 text-xs ml-1">{allPlatforms.length}</span></span>
                        : <span className="text-white/20 text-xs">none</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {user.profile_completed
                        ? <Badge label="Complete" color="green" />
                        : <Badge label="Incomplete" color="gray" />}
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">{formatRelativeTime(user.created_at)}</td>
                    <td className="px-4 py-3"><ChevronRight size={14} className="text-white/20" /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT: Detail Panel */}
      {(detailLoading || selected) && (
        <div className="w-96 shrink-0 bg-[#111] border border-white/10 rounded-2xl overflow-y-auto max-h-[calc(100vh-120px)]">
          {detailLoading ? (
            <div className="flex items-center justify-center h-48 text-white/30">Loading...</div>
          ) : selected && (
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {selected.user.photo_url
                    ? <img src={selected.user.photo_url} className="w-12 h-12 rounded-full object-cover" alt="" />
                    : <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg">{selected.user.name?.[0]?.toUpperCase()}</div>
                  }
                  <div>
                    <h2 className="font-bold text-white">{selected.user.name}</h2>
                    <p className="text-white/40 text-xs">{selected.user.phone}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge label={selected.user.verification_level || 'phone'} color={selected.user.verification_level === 'verified' ? 'green' : 'gray'} />
                      <Badge label={selected.user.subscription_tier || 'free'} color={selected.user.subscription_tier === 'pro' ? 'purple' : 'gray'} />
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-white/10"><X size={16} className="text-white/40" /></button>
              </div>

              {/* Core Profile */}
              <Section title="Profile">
                <Row label="Bio" value={selected.user.bio} />
                <Row label="Location" value={selected.user.location} />
                <Row label="Onboarding" value={selected.user.onboarding_method} />
                <Row label="Profile Complete" value={selected.user.profile_completed ? '✓ Yes' : '✗ No'} />
                <Row label="Joined" value={formatRelativeTime(selected.user.created_at)} />
                {(selected.user.skills || []).length > 0 && (
                  <div className="text-sm">
                    <span className="text-white/50">Skills</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(selected.user.skills || []).slice(0, 8).map(s => <Badge key={s} label={s} />)}
                    </div>
                  </div>
                )}
              </Section>

              {/* Data Sources — how profile was built */}
              <Section title="Profile Data Sources">
                {Object.entries(selected.profile_sources).filter(([, v]) => v).map(([field, source]) => (
                  <div key={field} className="flex items-center justify-between text-xs">
                    <span className="text-white/50">{field.replace(/_/g, ' ')}</span>
                    <Badge label={source!} color={source === 'fabric' ? 'purple' : source === 'github_oauth' ? 'gray' : 'blue'} />
                  </div>
                ))}
              </Section>

              {/* Social Connections */}
              <Section title="Connected Platforms">
                {Object.entries(selected.fabric.linked_at || {}).map(([platform, ts]) => (
                  <div key={platform} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: PLATFORM_COLORS[platform] || '#888' }} />
                      <span className="text-white capitalize">{platform}</span>
                      <Badge label="Fabric" color="purple" />
                    </div>
                    <span className="text-white/30 text-xs">{formatRelativeTime(ts)}</span>
                  </div>
                ))}
                {(selected.oauth.platforms || []).map(platform => (
                  <div key={platform} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {platform === 'github' ? <Github size={12} className="text-white/60" /> : <Youtube size={12} className="text-white/60" />}
                      <span className="text-white capitalize">{platform}</span>
                      <Badge label="OAuth" color="blue" />
                    </div>
                    <Badge label="Verified" color="green" />
                  </div>
                ))}
                {Object.keys(selected.fabric.linked_at || {}).length === 0 && (selected.oauth.platforms || []).length === 0 && (
                  <p className="text-white/30 text-sm">No platforms connected yet</p>
                )}
              </Section>

              {/* Fabric Enrichment */}
              {(selected.fabric.fabric_niche || selected.fabric.fabric_linkedin_headline || selected.fabric.fabric_ig_username) && (
                <Section title="Fabric Data">
                  <Row label="Niche" value={selected.fabric.fabric_niche} />
                  <Row label="Industry" value={selected.fabric.fabric_industry} />
                  <Row label="Experience" value={selected.fabric.fabric_experience_level} />
                  <Row label="LinkedIn Headline" value={selected.fabric.fabric_linkedin_headline} />
                  <Row label="LinkedIn Connections" value={selected.fabric.fabric_linkedin_connections?.toString()} />
                  <Row label="IG Username" value={selected.fabric.fabric_ig_username} />
                  <Row label="IG Followers" value={selected.fabric.fabric_ig_followers?.toString()} />
                  <Row label="IG Network Role" value={(selected.fabric as any).fabric_ig_network_role} />
                  <Row label="IG Activity Trend" value={(selected.fabric as any).fabric_ig_activity_trend} />
                  <Row label="Thread Count" value={selected.fabric.thread_count?.toString()} />
                  <Row label="Last Synced" value={selected.fabric.last_synced_at ? formatRelativeTime(selected.fabric.last_synced_at) : undefined} />
                  {(selected.fabric as any).fabric_ig_collection_names?.length > 0 && (
                    <div className="text-sm">
                      <span className="text-white/50">Saved Collections</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {((selected.fabric as any).fabric_ig_collection_names as string[]).slice(0, 8).map((c: string) => (
                          <Badge key={c} label={c} color="purple" />
                        ))}
                      </div>
                    </div>
                  )}
                  {(selected.fabric as any).fabric_ig_aspiration_accounts?.length > 0 && (
                    <div className="text-sm">
                      <span className="text-white/50">Aspiration Accounts</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {((selected.fabric as any).fabric_ig_aspiration_accounts as string[]).slice(0, 6).map((a: string) => (
                          <Badge key={a} label={`@${a}`} color="blue" />
                        ))}
                      </div>
                    </div>
                  )}
                  {(selected.fabric as any).fabric_ig_comment_targets?.length > 0 && (
                    <div className="text-sm">
                      <span className="text-white/50">Comment Targets</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {((selected.fabric as any).fabric_ig_comment_targets as string[]).slice(0, 6).map((a: string) => (
                          <Badge key={a} label={`@${a}`} color="green" />
                        ))}
                      </div>
                    </div>
                  )}
                  {(selected.fabric as any).fabric_ig_warm_matches?.length > 0 && (
                    <div className="text-sm">
                      <span className="text-white/50">Warm IG Matches on Gully</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {((selected.fabric as any).fabric_ig_warm_matches as any[]).slice(0, 5).map((m: any) => (
                          <Badge key={m.gully_user_id} label={m.name || m.ig_handle} color="yellow" />
                        ))}
                      </div>
                    </div>
                  )}
                  {(selected.fabric.fabric_extracted_skills || []).length > 0 && (
                    <div className="text-sm">
                      <span className="text-white/50">Extracted Skills</span>
                      <div className="flex flex-wrap gap-1 mt-1">{selected.fabric.fabric_extracted_skills.slice(0, 6).map(s => <Badge key={s} label={s} color="purple" />)}</div>
                    </div>
                  )}
                </Section>
              )}

              {/* OAuth Enrichment */}
              {selected.oauth.github?.username && (
                <Section title="GitHub Data">
                  <Row label="Username" value={selected.oauth.github.username} />
                  <Row label="Repos" value={selected.oauth.github.public_repos?.toString()} />
                  <Row label="Followers" value={selected.oauth.github.followers?.toString()} />
                  {(selected.oauth.github.languages || []).length > 0 && (
                    <div className="text-sm">
                      <span className="text-white/50">Languages</span>
                      <div className="flex flex-wrap gap-1 mt-1">{selected.oauth.github.languages.slice(0, 5).map((l: string) => <Badge key={l} label={l} />)}</div>
                    </div>
                  )}
                </Section>
              )}

              {/* Enriched Profile */}
              {selected.enrichment.enriched_profile?.summary && (
                <Section title="AI Enriched Profile">
                  <p className="text-white/70 text-xs leading-relaxed">{selected.enrichment.enriched_profile.summary}</p>
                  <Row label="Credibility" value={`${selected.enrichment.enriched_profile.credibility_score || 0}/100`} />
                  {selected.enrichment.hyper_profile && <Badge label="Hyper-profile built" color="purple" />}
                </Section>
              )}

              {/* Activity */}
              <Section title="Activity">
                <Row label="Requests" value={selected.activity.requests_count.toString()} />
                <Row label="Matches" value={selected.activity.matches_count.toString()} />
                <Row label="Connections" value={selected.activity.connections_count.toString()} />
                <Row label="Messages" value={`${selected.activity.message_count} in history`} />
              </Section>

              {/* Social Links */}
              {Object.values(selected.user.social_links || {}).some(Boolean) && (
                <Section title="Social Links">
                  {Object.entries(selected.user.social_links || {}).filter(([, v]) => v).map(([platform, url]) => (
                    <div key={platform} className="flex items-center justify-between text-sm">
                      <span className="text-white/50 capitalize">{platform}</span>
                      <a href={url!} target="_blank" rel="noreferrer" className="text-blue-400 text-xs truncate max-w-48 hover:underline">{url}</a>
                    </div>
                  ))}
                </Section>
              )}

              {/* Profile Intelligence / Mesh */}
              <Section title="Profile Intelligence">
                {!mesh ? (
                  <p className="text-white/30 text-xs">Building mesh...</p>
                ) : mesh.node ? (
                  <>
                    {/* Completeness score */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/50 text-xs">Profile Score</span>
                      <span className={`text-lg font-bold ${
                        (mesh.node.profile_completeness || 0) >= 70 ? 'text-green-400' :
                        (mesh.node.profile_completeness || 0) >= 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{mesh.node.profile_completeness || 0}%</span>
                    </div>
                    {/* Completeness bar */}
                    <div className="h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        style={{ width: `${mesh.node.profile_completeness || 0}%` }} />
                    </div>

                    {/* Category weight bars */}
                    {Object.entries(mesh.node.category_weights || {}).length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        {Object.entries(mesh.node.category_weights as Record<string, number>)
                          .sort(([,a],[,b]) => b - a).slice(0, 5)
                          .map(([cat, weight]) => {
                            const maxW = Math.max(...Object.values(mesh.node.category_weights as Record<string, number>))
                            const pct = maxW > 0 ? Math.round((weight / maxW) * 100) : 0
                            return (
                              <div key={cat}>
                                <div className="flex justify-between text-xs mb-0.5">
                                  <span className="text-white/60 capitalize">{cat.replace(/_/g, ' ')}</span>
                                  <span className="text-white/40">{weight.toFixed(1)}</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    )}

                    {/* Data sources used */}
                    {(mesh.node.sources || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(mesh.node.sources as string[]).map(s => (
                          <Badge key={s} label={s.replace(/_/g, ' ')} color={
                            s.includes('linkedin') ? 'blue' :
                            s.includes('instagram') || s.includes('fabric') ? 'purple' :
                            s.includes('github') ? 'gray' : 'green'
                          } />
                        ))}
                      </div>
                    )}

                    {/* Collab edges */}
                    {(mesh.collab_edges || []).length > 0 && (
                      <div>
                        <p className="text-white/30 text-xs mb-1">Auto-paired with</p>
                        {(mesh.collab_edges as any[]).slice(0, 3).map((edge: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-xs py-0.5">
                            <span className="text-white/60">{edge.other_user_name}</span>
                            <Badge label={edge.category_b?.replace(/_/g, ' ') || 'complement'} color="blue" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Demand signals */}
                    {(mesh.demand_signals || []).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <p className="text-white/30 text-xs mb-1">Open demand for their skills</p>
                        {(mesh.demand_signals as any[]).map((d: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-white/60 capitalize">{d.category?.replace(/_/g, ' ')}</span>
                            <span className="text-green-400">{d.request_count} requests</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-white/20 text-xs mt-2">
                      Last rebuilt: {mesh.rebuilt_at ? formatRelativeTime(mesh.rebuilt_at) : 'never'}
                    </p>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-white/30 text-xs mb-2">No mesh data yet</p>
                    <button
                      onClick={() => fetchUserMesh(selected.user.id).then(m => setMesh(m))}
                      className="flex items-center gap-1 mx-auto px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-xs hover:bg-purple-500/30"
                    >
                      <Zap size={10} /> Build Now
                    </button>
                  </div>
                )}
              </Section>

              {/* Raw ID */}
              <div className="mt-4 p-3 bg-white/5 rounded-xl">
                <p className="text-white/30 text-xs font-mono break-all">{selected.user.id}</p>
                {selected.fabric.fabric_user_id && <p className="text-purple-400/50 text-xs font-mono break-all mt-1">Fabric: {selected.fabric.fabric_user_id}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
