import { useState, useMemo } from 'react'
import GameCard from '../components/GameCard'
import EmptyState from '../components/EmptyState'
import { GENRES, STATUS_ORDER, STATUS_META, SORT_OPTIONS } from '../constants'

export default function Library({ games, onSelectGame, onAddGame }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [genre, setGenre] = useState('all')
  const [sort, setSort] = useState('recent')

  const visible = useMemo(() => {
    let list = games

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((g) => g.name.toLowerCase().includes(q))
    }
    if (status !== 'all') list = list.filter((g) => g.status === status)
    if (genre !== 'all') list = list.filter((g) => g.genre === genre)

    const sorted = [...list]
    switch (sort) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'hours':
        sorted.sort((a, b) => b.hours - a.hours)
        break
      default:
        sorted.sort((a, b) => b.addedAt - a.addedAt)
    }
    return sorted
  }, [games, search, status, genre, sort])

  return (
    <main>
      <div className="library-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search games…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search games"
          />
        </div>

        <div className="chip-row">
          <button
            className={`chip${status === 'all' ? ' active' : ''}`}
            onClick={() => setStatus('all')}
          >
            All
          </button>
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              className={`chip${status === s ? ' active' : ''}`}
              onClick={() => setStatus(s)}
            >
              {STATUS_META[s].label}
            </button>
          ))}
        </div>

        <select
          className="filter-select"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          aria-label="Filter by genre"
        >
          <option value="all">All Genres</option>
          {GENRES.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort games"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="library-grid">
        {games.length === 0 ? (
          <EmptyState
            icon="📦"
            title="Your shelf is empty"
            message="Add your first game to start tracking your library."
            actionLabel="+ Add your first game"
            onAction={onAddGame}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No matches"
            message="No games fit these filters — try widening your search."
          />
        ) : (
          visible.map((g) => <GameCard key={g.id} game={g} onClick={onSelectGame} />)
        )}
      </div>
    </main>
  )
}
