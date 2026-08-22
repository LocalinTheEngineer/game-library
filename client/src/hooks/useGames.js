import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'

export function useGames(user) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setGames([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      setGames(await api.list())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addGame = async (fields) => {
    const created = await api.create(fields)
    setGames((prev) => [created, ...prev])
  }

  const updateGame = async (id, fields) => {
    const updated = await api.update(id, fields)
    setGames((prev) => prev.map((g) => (g.id === id ? updated : g)))
  }

  const deleteGame = async (id) => {
    await api.remove(id)
    setGames((prev) => prev.filter((g) => g.id !== id))
  }

  return { games, loading, error, refresh, addGame, updateGame, deleteGame }
}
