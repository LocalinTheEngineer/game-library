import { useState, useEffect, useCallback } from 'react'
import { api, setToken, onSessionExpired } from '../api'

const STORAGE_KEY = 'gl_token'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    onSessionExpired(signOut)
  }, [signOut])

  // Sayfa yenilendiğinde kayıtlı jetonun hâlâ geçerli olduğunu sunucuya doğrulatıyoruz.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setChecking(false)
      return
    }

    setToken(stored)
    api
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setChecking(false))
  }, [])

  const accept = ({ user: nextUser, token }) => {
    localStorage.setItem(STORAGE_KEY, token)
    setToken(token)
    setUser(nextUser)
  }

  const signIn = async (credentials) => accept(await api.login(credentials))
  const register = async (details) => accept(await api.register(details))

  const setVisibility = async (isPublic) => setUser(await api.setVisibility(isPublic))

  return { user, checking, signIn, register, signOut, setVisibility }
}
