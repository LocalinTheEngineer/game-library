import Cover from './Cover'

export default function TopGames({ games, onSelectGame }) {
  const max = Math.max(...games.map((g) => g.hours), 1)

  return (
    <div className="chart-block">
      <h3>Most played</h3>
      <ul className="top-games">
        {games.map((game) => (
          <li key={game.id}>
            <button onClick={() => onSelectGame(game)}>
              <Cover src={game.coverImage} name={game.name} className="cover-thumb" />
              <span className="top-game-text">
                <span className="top-game-name">{game.name}</span>
                <span className="top-game-track">
                  <span
                    className="top-game-fill"
                    style={{ width: `${(game.hours / max) * 100}%` }}
                  />
                </span>
              </span>
              <span className="top-game-hours">{game.hours}h</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
