const VIEWS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'library', label: 'Library' },
  { id: 'stats', label: 'Stats' },
]

export default function Topbar({ view, onViewChange, theme, onToggleTheme, onAddGame }) {
  return (
    <header className="topbar">
      <div className="brand">
        <h1>🎮 Game Library</h1>
        <span className="tag">v2 · react</span>
      </div>

      <nav className="tabs">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            className={view === v.id ? 'active' : ''}
            onClick={() => onViewChange(v.id)}
          >
            {v.label}
          </button>
        ))}
      </nav>

      <div className="topbar-actions">
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          {theme === 'light' ? '☀️' : '🌙'}
        </button>
        <button className="btn-primary" onClick={onAddGame}>
          + Add Game
        </button>
      </div>
    </header>
  )
}
