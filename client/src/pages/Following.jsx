import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import EmptyState from '../components/EmptyState'

function openProfile(username) {
  window.location.hash = `#/u/${encodeURIComponent(username)}`
}

export default function Following() {
  const [people, setPeople] = useState([])
  const [status, setStatus] = useState('loading')

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      setPeople(await api.following())
      setStatus('ready')
    } catch {
      setStatus('failed')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stopFollowing = async (username) => {
    await api.unfollow(username)
    setPeople((prev) => prev.filter((p) => p.username !== username))
  }

  if (status === 'loading') {
    return <p className="notice">Loading…</p>
  }

  if (status === 'failed') {
    return (
      <div className="notice notice-error">
        <p>Couldn&apos;t load the list.</p>
        <button className="btn-secondary" onClick={load}>
          Retry
        </button>
      </div>
    )
  }

  if (people.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="Not following anyone yet"
        message="Open someone's shared profile and follow them to see their library here."
      />
    )
  }

  return (
    <main>
      <ul className="people">
        {people.map((person) => (
          <li key={person.username}>
            <button className="person-card" onClick={() => openProfile(person.username)}>
              <span className="person-avatar">{person.username.slice(0, 1).toUpperCase()}</span>
              <span className="person-text">
                <span className="person-name">{person.username}</span>
                <span className="person-meta">
                  {person.total} games · {person.hours}h · {person.completed} finished
                </span>
              </span>
              {person.playing > 0 && (
                <span className="person-playing">{person.playing} playing</span>
              )}
            </button>
            <button
              className="btn-secondary person-unfollow"
              onClick={() => stopFollowing(person.username)}
            >
              Unfollow
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
