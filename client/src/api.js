const base = import.meta.env.VITE_API_URL || '/api'

let token = null
let onUnauthorized = null

export function setToken(value) {
  token = value
}

export function onSessionExpired(handler) {
  onUnauthorized = handler
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(base + path, { ...options, headers })

  if (res.status === 401) {
    onUnauthorized?.()
    throw new Error('Your session has expired. Please sign in again.')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.errors?.join(', ') || body?.error || `Request failed (${res.status})`
    throw new Error(message)
  }

  return res.status === 204 ? null : res.json()
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  setVisibility: (isPublic) =>
    request('/auth/me', { method: 'PATCH', body: JSON.stringify({ isPublic }) }),
  profile: (username) => request(`/profiles/${encodeURIComponent(username)}`),
  following: () => request('/follows'),
  follow: (username) => request(`/follows/${encodeURIComponent(username)}`, { method: 'PUT' }),
  unfollow: (username) => request(`/follows/${encodeURIComponent(username)}`, { method: 'DELETE' }),
  list: () => request('/games'),
  search: (term) => request(`/search?q=${encodeURIComponent(term)}`),
  create: (game) => request('/games', { method: 'POST', body: JSON.stringify(game) }),
  update: (id, game) => request(`/games/${id}`, { method: 'PUT', body: JSON.stringify(game) }),
  remove: (id) => request(`/games/${id}`, { method: 'DELETE' }),
}
