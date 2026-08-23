import { query } from './db/pool.js'

const PROFILE_QUERY = `
  SELECT ug.id, g.name, g.genre, g.platform, g.cover_image, g.release_year,
         ug.status, ug.hours_played, ug.rating, ug.added_at
  FROM user_games ug
  JOIN games g ON g.id = ug.game_id
  WHERE ug.user_id = $1
  ORDER BY ug.added_at DESC
`

// Notlar kişisel; herkese açık profilde paylaşılmıyor.
function toPublicEntry(row) {
  return {
    id: row.id,
    name: row.name,
    genre: row.genre,
    platform: row.platform,
    coverImage: row.cover_image,
    releaseYear: row.release_year,
    status: row.status,
    hours: row.hours_played,
    rating: row.rating,
    addedAt: Date.parse(row.added_at),
  }
}

export async function findPublicProfile(username) {
  const { rows } = await query(
    'SELECT id, username, is_public, created_at FROM users WHERE lower(username) = lower($1)',
    [username]
  )

  const user = rows[0]
  if (!user || !user.is_public) return null

  const library = await query(PROFILE_QUERY, [user.id])

  return {
    id: user.id,
    username: user.username,
    memberSince: Date.parse(user.created_at),
    games: library.rows.map(toPublicEntry),
  }
}
