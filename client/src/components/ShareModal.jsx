import { useState } from 'react'

function profileUrl(username) {
  const { origin, pathname } = window.location
  return `${origin}${pathname}#/u/${encodeURIComponent(username)}`
}

export default function ShareModal({ user, onSetVisibility, onClose }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const url = profileUrl(user.username)

  const toggle = async () => {
    setBusy(true)
    setError(null)
    try {
      await onSetVisibility(!user.isPublic)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Copying failed — select the link and copy it manually.')
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>Share your library</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="share-toggle">
          <div>
            <span className="share-toggle-title">Public profile</span>
            <p className="share-toggle-hint">
              {user.isPublic
                ? 'Anyone with the link can see your games, hours, and ratings. Your notes stay private.'
                : 'Your library is private. Turn this on to share it with a link.'}
            </p>
          </div>
          <button
            className={`switch${user.isPublic ? ' on' : ''}`}
            onClick={toggle}
            disabled={busy}
            role="switch"
            aria-checked={user.isPublic}
            aria-label="Public profile"
          >
            <span className="switch-knob" />
          </button>
        </div>

        {user.isPublic && (
          <div className="share-link">
            <input type="text" readOnly value={url} onFocus={(e) => e.target.select()} />
            <button className="btn-secondary" onClick={copy}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}
      </div>
    </div>
  )
}
