import { useState, useEffect, useMemo } from 'react'
import { api } from '../api'
import GameCard from '../components/GameCard'
import LibrarySkeleton from '../components/Skeleton'
import { STATUS_ORDER, STATUS_META } from '../constants'

function StatCell({ value, label }) {
  return (
    <div className="stat-cell">
      <span className="stat-num">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function Profile({ username, theme, onToggleTheme, onGoHome, isSignedIn }) {
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading')
  const [filter, setFilter] = useState('all')
  const [following, setFollowing] = useState(false)
  const [followBusy, setFollowBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    api
      .profile(username)
      .then((data) => {
        if (!cancelled) {
          setProfile(data)
          setFollowing(data.following)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('missing')
      })

    return () => {
      cancelled = true
    }
  }, [username])

  const toggleFollow = async () => {
    setFollowBusy(true)
    try {
      if (following) {
        await api.unfollow(profile.username)
        setFollowing(false)
      } else {
        await api.follow(profile.username)
        setFollowing(true)
      }
    } catch {
      // Sessizce geç; buton eski durumuna döner.
    } finally {
      setFollowBusy(false)
    }
  }

  const stats = useMemo(() => {
    if (!profile) return null
    const games = profile.games
    const rated = games.filter((g) => g.rating > 0)

    return {
      total: games.length,
      hours: games.reduce((sum, g) => sum + g.hours, 0),
      completed: games.filter((g) => g.status === 'completed').length,
      avgRating: rated.length
        ? (rated.reduce((sum, g) => sum + g.rating, 0) / rated.length).toFixed(1)
        : '–',
    }
  }, [profile])

  const visible = useMemo(() => {
    if (!profile) return []
    return filter === 'all' ? profile.games : profile.games.filter((g) => g.status === filter)
  }, [profile, filter])

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-row">
          <button className="brand brand-link" onClick={onGoHome}>
            <h1>🎮 Game Library</h1>
          </button>

          <div className="topbar-actions">
            <button
              className="icon-btn"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '☀️' : '🌙'}
            </button>
            {isSignedIn && status === 'ready' && profile && !profile.isSelf && (
              <button
                className={following ? 'btn-secondary' : 'btn-primary'}
                onClick={toggleFollow}
                disabled={followBusy}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
            <button className="btn-secondary" onClick={onGoHome}>
              {isSignedIn ? 'My library' : 'Sign in'}
            </button>
          </div>
        </div>
      </header>

      {status === 'loading' && <LibrarySkeleton count={4} />}

      {status === 'missing' && (
        <div className="empty-state">
          <div className="icon">🔒</div>
          <h3>Nothing to see here</h3>
          <p>This profile doesn&apos;t exist, or its owner keeps it private.</p>
        </div>
      )}

      {status === 'ready' && profile && (
        <main>
          <h2 className="greeting">{profile.username}&apos;s library</h2>
          <p className="greeting-sub">
            Member since{' '}
            {new Date(profile.memberSince).toLocaleDateString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <div className="stat-strip">
            <StatCell value={stats.total} label="Games" />
            <StatCell value={stats.hours} label="Hours" />
            <StatCell value={stats.completed} label="Completed" />
            <StatCell value={stats.avgRating} label="Avg. rating" />
          </div>

          {profile.games.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📦</div>
              <h3>Empty shelf</h3>
              <p>{profile.username} hasn&apos;t added any games yet.</p>
            </div>
          ) : (
            <>
              <div className="library-controls">
                <div className="chip-row">
                  <button
                    className={`chip${filter === 'all' ? ' active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  {STATUS_ORDER.filter((s) => profile.games.some((g) => g.status === s)).map(
                    (s) => (
                      <button
                        key={s}
                        className={`chip${filter === s ? ' active' : ''}`}
                        onClick={() => setFilter(s)}
                      >
                        {STATUS_META[s].label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="library-grid">
                {visible.map((game) => (
                  <GameCard key={game.id} game={game} onClick={() => {}} />
                ))}
              </div>
            </>
          )}
        </main>
      )}

      <footer className="credit">
        Game data and cover art from{' '}
        <a href="https://rawg.io" target="_blank" rel="noreferrer">
          RAWG
        </a>
      </footer>
    </div>
  )
}
