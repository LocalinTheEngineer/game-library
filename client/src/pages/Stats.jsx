import { useMemo } from 'react'
import BarChart from '../components/BarChart'
import EmptyState from '../components/EmptyState'
import { STATUS_ORDER, STATUS_META } from '../constants'

function StatBox({ num, label }) {
  return (
    <div className="stat-box">
      <div className="stat-num">{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function Stats({ games, onAddGame }) {
  const data = useMemo(() => {
    const rated = games.filter((g) => g.rating > 0)
    const genreCounts = games.reduce((acc, g) => {
      acc[g.genre] = (acc[g.genre] || 0) + 1
      return acc
    }, {})

    return {
      total: games.length,
      completed: games.filter((g) => g.status === 'completed').length,
      hours: games.reduce((sum, g) => sum + g.hours, 0),
      avgRating: rated.length
        ? (rated.reduce((sum, g) => sum + g.rating, 0) / rated.length).toFixed(1)
        : '–',
      genreRows: Object.entries(genreCounts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count),
      statusRows: STATUS_ORDER.map((s) => ({
        label: STATUS_META[s].label,
        count: games.filter((g) => g.status === s).length,
        color: STATUS_META[s].color,
      })),
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
        <StatBox num={data.total} label="Total Games" />
        <StatBox num={data.completed} label="Completed" />
        <StatBox num={data.hours} label="Hours Played" />
        <StatBox num={data.avgRating} label="Avg. Rating" />
      </div>

      <BarChart title="Games by Genre" rows={data.genreRows} />
      <BarChart title="Games by Status" rows={data.statusRows} />
    </main>
  )
}
