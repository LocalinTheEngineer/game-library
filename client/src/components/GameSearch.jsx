import { useState, useEffect, useRef } from 'react'
import { api } from '../api'
import Cover from './Cover'

export default function GameSearch({ onPick, onSkip }) {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Her tuşta istek atmamak için kısa bir bekleme.
  useEffect(() => {
    if (term.trim().length < 2) {
      setResults([])
      setStatus('idle')
      return
    }

    const timer = setTimeout(async () => {
      setStatus('loading')
      try {
        setResults(await api.search(term))
        setStatus('done')
      } catch {
        setStatus('failed')
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [term])

  return (
    <div className="search-step">
      <div className="field">
        <label htmlFor="rawg-search">Find a game</label>
        <input
          id="rawg-search"
          ref={inputRef}
          type="text"
          placeholder="Start typing a title…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          autoComplete="off"
        />
      </div>

      {status === 'loading' && <p className="search-hint">Searching…</p>}
      {status === 'failed' && (
        <p className="search-hint">Search is unavailable. You can still add the game manually.</p>
      )}
      {status === 'done' && results.length === 0 && (
        <p className="search-hint">Nothing matched. Try another spelling, or add it manually.</p>
      )}

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((item) => (
            <li key={item.rawgId}>
              <button type="button" onClick={() => onPick(item)}>
                <Cover src={item.coverImage} name={item.name} className="cover-thumb" />
                <span className="result-text">
                  <span className="result-name">{item.name}</span>
                  <span className="result-meta">
                    {[item.releaseYear, item.genre, item.platform].filter(Boolean).join(' · ')}
                  </span>
                </span>
                {item.metacritic && <span className="result-score">{item.metacritic}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="link-button" onClick={onSkip}>
        Enter details manually instead
      </button>
    </div>
  )
}
