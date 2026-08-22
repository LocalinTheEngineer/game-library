import { STATUSES, GENRES, PLATFORMS } from './constants.js'

const CURRENT_YEAR = new Date().getFullYear()

function isSafeImageUrl(value) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function validateGame(body) {
  const errors = []
  const name = typeof body.name === 'string' ? body.name.trim() : ''

  if (!name) {
    errors.push('name is required')
  } else if (name.length > 120) {
    errors.push('name must be 120 characters or fewer')
  }

  if (!GENRES.includes(body.genre)) errors.push('genre is not a known value')
  if (!PLATFORMS.includes(body.platform)) errors.push('platform is not a known value')
  if (!STATUSES.includes(body.status)) errors.push('status is not a known value')

  const hours = Number(body.hours)
  if (!Number.isFinite(hours) || hours < 0) errors.push('hours must be zero or more')

  const rating = Number(body.rating)
  if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
    errors.push('rating must be an integer between 0 and 5')
  }

  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''
  if (notes.length > 2000) errors.push('notes must be 2000 characters or fewer')

  let coverImage = null
  if (body.coverImage) {
    if (typeof body.coverImage === 'string' && isSafeImageUrl(body.coverImage)) {
      coverImage = body.coverImage
    } else {
      errors.push('coverImage must be an https url')
    }
  }

  let releaseYear = null
  if (body.releaseYear !== null && body.releaseYear !== undefined && body.releaseYear !== '') {
    const year = Number(body.releaseYear)
    if (!Number.isInteger(year) || year < 1950 || year > CURRENT_YEAR + 5) {
      errors.push('releaseYear looks wrong')
    } else {
      releaseYear = year
    }
  }

  if (errors.length) return { errors }

  return {
    game: {
      name,
      genre: body.genre,
      platform: body.platform,
      status: body.status,
      hours: Math.floor(hours),
      rating,
      notes,
      coverImage,
      releaseYear,
    },
  }
}
