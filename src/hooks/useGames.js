import { useLocalStorage } from './useLocalStorage'
import { seedGames, makeId } from '../seed'

export function useGames() {
  const [games, setGames] = useLocalStorage('gl_games_v2', seedGames)

  const addGame = (data) => {
    setGames((prev) => [{ ...data, id: makeId(), addedAt: Date.now() }, ...prev])
  }

  const updateGame = (id, data) => {
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)))
  }

  const deleteGame = (id) => {
    setGames((prev) => prev.filter((g) => g.id !== id))
  }

  return { games, addGame, updateGame, deleteGame }
}
