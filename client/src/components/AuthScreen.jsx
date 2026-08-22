import { useState } from 'react'

export default function AuthScreen({ onSignIn, onRegister }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const isRegister = mode === 'register'
  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register')
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)

    try {
      if (isRegister) {
        await onRegister(form)
      } else {
        await onSignIn({ email: form.email, password: form.password })
      }
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <h1>🎮 Game Library</h1>
          <p>{isRegister ? 'Create an account to start tracking.' : 'Sign in to your library.'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={form.username}
                onChange={(e) => setField('username', e.target.value)}
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
            />
            {isRegister && <p className="field-hint">At least 8 characters.</p>}
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary auth-submit" disabled={busy}>
            {busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>

          {busy && <p className="field-hint auth-wait">The server sleeps when idle — the first request can take a minute.</p>}
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New here?'}{' '}
          <button type="button" className="link-button" onClick={switchMode}>
            {isRegister ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  )
}
