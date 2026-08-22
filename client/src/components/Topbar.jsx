import { useState, useEffect, useRef } from 'react'

const VIEWS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'library', label: 'Library' },
  { id: 'stats', label: 'Stats' },
]

export default function Topbar({
  view,
  onViewChange,
  theme,
  onToggleTheme,
  onAddGame,
  username,
  onSignOut,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return

    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  return (
    <header className="topbar">
      <div className="brand">
        <h1>🎮 Game Library</h1>
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

        <div className="account" ref={menuRef}>
          <button
            className="avatar"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            {username.slice(0, 1).toUpperCase()}
          </button>

          {menuOpen && (
            <div className="account-menu" role="menu">
              <span className="account-name">{username}</span>
              <button onClick={onSignOut} role="menuitem">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
