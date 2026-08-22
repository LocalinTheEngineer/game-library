import { STATUS_META } from '../constants'
import Stars from './Stars'
import Cover from './Cover'

export default function GameCard({ game, onClick }) {
  const meta = STATUS_META[game.status]

  return (
    <button className="game-card" onClick={() => onClick(game)}>
      <span className="card-art">
        <Cover src={game.coverImage} name={game.name} />
        <span className="card-status" style={{ background: meta.color }}>
          {meta.label}
        </span>
      </span>

      <span className="card-body">
        <span className="card-title">{game.name}</span>
        <span className="card-meta">
          {game.genre} · {game.platform}
          {game.releaseYear ? ` · ${game.releaseYear}` : ''}
        </span>
        <span className="card-bottom">
          <span className="hours">{game.hours}h</span>
          <Stars rating={game.rating} />
        </span>
      </span>
    </button>
  )
}
