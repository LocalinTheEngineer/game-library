import { useMemo } from 'react'
import BarChart from '../components/BarChart'
import DonutChart from '../components/DonutChart'
import TopGames from '../components/TopGames'
import Achievements from '../components/Achievements'
import ActivityChart from '../components/ActivityChart'
import EmptyState from '../components/EmptyState'
import { STATUS_ORDER, STATUS_META, OWNED_STATUSES } from '../constants'
import { computeAchievements } from '../achievements'

const PLATFORM_COLORS = {
  PC: 'var(--accent)',
  PlayStation: '#4c8bf5',
  Xbox: '#34d399',
  Nintendo: '#fb7185',
  Mobile: '#f5a623',
  Other: 'var(--text-faint)',
}

function StatBox({ value, label, hint }) {
  return (
    <div className="stat-box">
      <div className="stat-num">{value}</div>
      <div className="stat-label">{label}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  )
}

function countBy(games, key) {
  return games.reduce((acc, game) => {
    acc[game[key]] = (acc[game[key]] || 0) + 1
    return acc
  }, {})
}

function toRows(counts, colorFor) {
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count, color: colorFor?.(label) }))
    .sort((a, b) => b.count - a.count)
}

export default function Stats({ games, onSelectGame, onAddGame }) {
  const achievements = useMemo(() => computeAchievements(games), [games])

  const data = useMemo(() => {
    // Wishlist henüz sahip olunmayan oyunlar; ortalamaları bozmasın.
    const owned = games.filter((g) => OWNED_STATUSES.includes(g.status))
    const rated = owned.filter((g) => g.rating > 0)
    const finished = owned.filter((g) => g.status === 'completed')
    const totalHours = owned.reduce((sum, g) => sum + g.hours, 0)

    const ratingRows = [5, 4, 3, 2, 1].map((score) => ({
      label: '★'.repeat(score),
      count: owned.filter((g) => g.rating === score).length,
      color: 'var(--star)',
    }))

    const hoursByGenre = owned.reduce((acc, game) => {
      acc[game.genre] = (acc[game.genre] || 0) + game.hours
      return acc
    }, {})

    return {
      total: owned.length,
      wishlist: games.length - owned.length,
      totalHours,
      completed: finished.length,
      completionRate: owned.length ? Math.round((finished.length / owned.length) * 100) : 0,
      avgRating: rated.length
        ? (rated.reduce((sum, g) => sum + g.rating, 0) / rated.length).toFixed(1)
        : '–',
      ratedCount: rated.length,
      avgHours: owned.length ? Math.round(totalHours / owned.length) : 0,
      statusSegments: STATUS_ORDER.map((status) => ({
        label: STATUS_META[status].label,
        count: games.filter((g) => g.status === status).length,
        color: STATUS_META[status].color,
      })),
      genreRows: toRows(countBy(owned, 'genre')),
      platformRows: toRows(countBy(owned, 'platform'), (name) => PLATFORM_COLORS[name]),
      ratingRows,
      hoursByGenreRows: Object.entries(hoursByGenre)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
      topPlayed: [...owned]
        .filter((g) => g.hours > 0)
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 5),
    }
  }, [games])

  if (games.length === 0) {
    return (
      <main>
        <EmptyState
          icon="📊"
          title="No data yet"
          message="Add a few games and your stats will show up here."
          actionLabel="+ Add your first game"
          onAction={onAddGame}
        />
      </main>
    )
  }

  return (
    <main>
      <div className="stats-grid">
        <StatBox
          value={data.total}
          label="Games"
          hint={data.wishlist ? `${data.wishlist} on the wishlist` : null}
        />
        <StatBox
          value={data.totalHours}
          label="Hours played"
          hint={`${data.avgHours}h average`}
        />
        <StatBox
          value={`${data.completionRate}%`}
          label="Completed"
          hint={`${data.completed} of ${data.total}`}
        />
        <StatBox
          value={data.avgRating}
          label="Average rating"
          hint={data.ratedCount ? `${data.ratedCount} rated` : 'Nothing rated yet'}
        />
      </div>

      <div className="chart-block">
        <h3>Where your library stands</h3>
        <DonutChart
          segments={data.statusSegments}
          centerValue={data.total}
          centerLabel="games"
        />
      </div>

      {data.topPlayed.length > 0 && (
        <TopGames games={data.topPlayed} onSelectGame={onSelectGame} />
      )}

      <div className="chart-pair">
        <BarChart title="Games by genre" rows={data.genreRows} />
        <BarChart title="Games by platform" rows={data.platformRows} />
      </div>

      <div className="chart-pair">
        <BarChart title="Hours by genre" rows={data.hoursByGenreRows} unit="h" />
        <BarChart title="How you rate" rows={data.ratingRows} />
      </div>

      <ActivityChart games={games} />

      <Achievements items={achievements} />
    </main>
  )
}
