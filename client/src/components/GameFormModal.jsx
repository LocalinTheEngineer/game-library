import { useState, useEffect, useRef } from 'react'
import { GENRES, PLATFORMS, STATUS_ORDER, STATUS_META } from '../constants'

const BLANK = {
  name: '',
  genre: 'Action',
  platform: 'PC',
  status: 'playing',
  hours: 0,
  rating: 0,
  notes: '',
}

export default function GameFormModal({ game, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(BLANK)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const nameRef = useRef(null)
  const isEditing = Boolean(game)

  useEffect(() => {
    setForm(game ? { ...BLANK, ...game } : BLANK)
    nameRef.current?.focus()
  }, [game])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return

    setBusy(true)
    setError(null)
    try {
      await onSave({
        name,
        genre: form.genre,
        platform: form.platform,
        status: form.status,
        hours: Math.max(0, parseInt(form.hours, 10) || 0),
        rating: form.rating,
        notes: form.notes.trim(),
      })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${game.name}" from your library?`)) return

    setBusy(true)
    setError(null)
    try {
      await onDelete(game.id)
    } catch (err) {
      setError(err.message)
      setBusy(false)
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
          <h2>{isEditing ? 'Edit Game' : 'Add Game'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Game Name</label>
            <input
              id="name"
              ref={nameRef}
              type="text"
              required
              placeholder="e.g. Cyberpunk 2077"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="genre">Genre</label>
              <select
                id="genre"
                value={form.genre}
                onChange={(e) => setField('genre', e.target.value)}
              >
                {GENRES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="platform">Platform</label>
              <select
                id="platform"
                value={form.platform}
                onChange={(e) => setField('platform', e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="hours">Hours Played</label>
              <input
                id="hours"
                type="number"
                min="0"
                step="1"
                value={form.hours}
                onChange={(e) => setField('hours', e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Rating</label>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n <= form.rating ? 'filled' : ''}
                  onClick={() => setField('rating', n === form.rating ? 0 : n)}
                  aria-label={`Rate ${n} stars`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              placeholder="Your thoughts on this game…"
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            {isEditing && (
              <button type="button" className="btn-danger" onClick={handleDelete} disabled={busy}>
                Delete
              </button>
            )}
            <div className="right-group">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={busy}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? 'Saving…' : 'Save Game'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
