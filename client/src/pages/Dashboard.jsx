import { useMemo } from 'react'
import GameCard from '../components/GameCard'
import EmptyState from '../components/EmptyState'

function StatCell({ num, label }) {
  return (
    <div className="stat-cell">
      <span className="stat-num">{num}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function Dashboard({ games, username, onSelectGame, onAddGame, onGoToLibrary }) {
  const stats = useMemo(() => {
    const by = (s) => games.filter((g) => g.status === s).length
    return {
      total: games.length,
      playing: by('playing'),
      completed: by('completed'),
      backlog: by('backlog'),
      hours: games.reduce((sum, g) => sum + g.hours, 0),
    }
  }, [games])

  const nowPlaying = useMemo(
    () =>
      games
        .filter((g) => g.status === 'playing')
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 4),
    [games]
  )

  const recentlyAdded = useMemo(
    () => [...games].sort((a, b) => b.addedAt - a.addedAt).slice(0, 4),
    [games]
  )

  return (
    <main>
      <h2 className="greeting">Welcome back, {username} 👋</h2>
      <p className="greeting-sub">Here&apos;s what&apos;s happening in your library.</p>

      <div className="stat-strip">
        <StatCell num={stats.total} label="Games" />
        <StatCell num={stats.playing} label="Playing" />
        <StatCell num={stats.completed} label="Completed" />
        <StatCell num={stats.backlog} label="Backlog" />
        <StatCell num={stats.hours} label="Hours Played" />
      </div>

      <section className="block">
        <div className="block-head">
          <h2>Continue Playing</h2>
          <button className="see-all" onClick={onGoToLibrary}>
            See all →
          </button>
        </div>
        <div className="card-row">
          {nowPlaying.length > 0 ? (
            nowPlaying.map((g) => <GameCard key={g.id} game={g} onClick={onSelectGame} />)
          ) : (
            <EmptyState
              icon="🎯"
              title="Nothing in progress"
              message="Mark a game as Playing to see it here."
            />
          )}
        </div>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Recently Added</h2>
          <button className="see-all" onClick={onGoToLibrary}>
            See all →
          </button>
        </div>
        <div className="card-row">
          {recentlyAdded.length > 0 ? (
            recentlyAdded.map((g) => <GameCard key={g.id} game={g} onClick={onSelectGame} />)
          ) : (
            <EmptyState
              icon="📦"
              title="Your shelf is empty"
              message="Add your first game to start tracking your library."
              actionLabel="+ Add your first game"
              onAction={onAddGame}
            />
          )}
        </div>
      </section>
    </main>
  )
}
