import { useState, useEffect, useRef } from 'react'

const VIEWS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'library', label: 'Library' },
  { id: 'stats', label: 'Stats' },
  { id: 'following', label: 'Following' },
]

export default function Topbar({
  view,
  onViewChange,
  theme,
  onToggleTheme,
  onAddGame,
  username,
  onSignOut,
  onShare,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return

    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    const escape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [menuOpen])

  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="brand">
          <h1>🎮 Game Library</h1>
        </div>

        <div className="topbar-actions">
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {theme === 'light' ? '☀️' : '🌙'}
          </button>

          <button className="btn-primary add-button" onClick={onAddGame}>
            <span className="add-full">+ Add Game</span>
            <span className="add-short">+</span>
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
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    onShare()
                  }}
                  role="menuitem"
                >
                  Share library
                </button>
                <button onClick={onSignOut} role="menuitem">
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="tabs">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            className={view === v.id ? 'active' : ''}
            onClick={() => onViewChange(v.id)}
            aria-current={view === v.id ? 'page' : undefined}
          >
            {v.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
