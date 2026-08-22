import { GENRES, PLATFORMS } from './constants.js'

const BASE = process.env.RAWG_BASE_URL || 'https://api.rawg.io/api'
const CACHE_TTL = 1000 * 60 * 60 * 6

// Ücretsiz katman ayda 20.000 istekle sınırlı, aynı aramayı iki kez sormuyoruz.
const cache = new Map()

function readCache(key) {
  const hit = cache.get(key)
  if (!hit) return null
  if (Date.now() - hit.at > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return hit.value
}

function writeCache(key, value) {
  cache.set(key, { value, at: Date.now() })
  if (cache.size > 200) cache.delete(cache.keys().next().value)
}

// RAWG'ın tür ve platform isimleri bizim listemizle birebir örtüşmüyor.
const GENRE_ALIASES = {
  'Role-Playing Games (RPG)': 'RPG',
  Indie: 'Other',
  Casual: 'Other',
  Platformer: 'Adventure',
  Arcade: 'Action',
  Fighting: 'Action',
  Family: 'Other',
  'Board Games': 'Other',
  'Card Games': 'Other',
  Educational: 'Other',
  'Massively Multiplayer': 'Other',
}

const PLATFORM_ALIASES = {
  PlayStation: 'PlayStation',
  Xbox: 'Xbox',
  Nintendo: 'Nintendo',
  PC: 'PC',
  Linux: 'PC',
  macOS: 'PC',
  Apple: 'Mobile',
  Android: 'Mobile',
  iOS: 'Mobile',
}

function pickGenre(genres = []) {
  for (const { name } of genres) {
    const mapped = GENRE_ALIASES[name] || name
    if (GENRES.includes(mapped)) return mapped
  }
  return 'Other'
}

function pickPlatform(platforms = []) {
  for (const entry of platforms) {
    const name = entry.platform?.name || ''
    for (const [needle, mapped] of Object.entries(PLATFORM_ALIASES)) {
      if (name.startsWith(needle)) return mapped
    }
  }
  return PLATFORMS[0]
}

function toSuggestion(result) {
  return {
    rawgId: result.id,
    name: result.name,
    genre: pickGenre(result.genres),
    platform: pickPlatform(result.parent_platforms || result.platforms),
    coverImage: result.background_image || null,
    releaseYear: result.released ? Number(result.released.slice(0, 4)) : null,
    metacritic: result.metacritic ?? null,
  }
}

export async function searchGames(term) {
  const key = process.env.RAWG_API_KEY
  if (!key) throw Object.assign(new Error('RAWG_API_KEY is not set'), { status: 503 })

  const query = term.trim().toLowerCase()
  const cached = readCache(query)
  if (cached) return cached

  const url = `${BASE}/games?key=${key}&search=${encodeURIComponent(query)}&page_size=8`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })

  if (!res.ok) {
    throw Object.assign(new Error('Game search is unavailable right now'), { status: 502 })
  }

  const body = await res.json()
  const suggestions = (body.results || []).map(toSuggestion)
  writeCache(query, suggestions)
  return suggestions
}
