import { STATUS_META } from '../constants'
import Stars from './Stars'

export default function GameCard({ game, onClick }) {
  const meta = STATUS_META[game.status]

  return (
    <button className="game-card" onClick={() => onClick(game)}>
      <span className="card-edge" style={{ background: meta.color }} />
      <span className="card-body">
        <span className="card-top">
          <span className="card-title">{game.name}</span>
          <span className="badge" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </span>
        <span className="card-meta">
          {game.genre} • {game.platform}
        </span>
        <span className="card-bottom">
          <span className="hours">{game.hours}h</span>
          <Stars rating={game.rating} />
        </span>
      </span>
    </button>
  )
}
