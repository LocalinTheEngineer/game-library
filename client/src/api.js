const base = import.meta.env.VITE_API_URL || '/api'

async function request(path, options) {
  const res = await fetch(base + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.errors?.join(', ') || body?.error || `Request failed (${res.status})`
    throw new Error(message)
  }

  return res.status === 204 ? null : res.json()
}

export const api = {
  list: () => request('/games'),
  create: (game) => request('/games', { method: 'POST', body: JSON.stringify(game) }),
  update: (id, game) => request(`/games/${id}`, { method: 'PUT', body: JSON.stringify(game) }),
  remove: (id) => request(`/games/${id}`, { method: 'DELETE' }),
}
