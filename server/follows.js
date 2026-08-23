import { query } from './db/pool.js'

// Takip edilenlerin kütüphane özetini tek sorguda çıkarıyoruz;
// kullanıcı başına ayrı sorgu atmak listede N+1 yaratırdı.
const FOLLOWING_SUMMARY = `
  SELECT u.username,
         f.created_at AS followed_at,
         count(ug.id)::int AS total,
         coalesce(sum(ug.hours_played), 0)::int AS hours,
         count(ug.id) FILTER (WHERE ug.status = 'completed')::int AS completed,
         count(ug.id) FILTER (WHERE ug.status = 'playing')::int AS playing
  FROM follows f
  JOIN users u ON u.id = f.following_id
  LEFT JOIN user_games ug ON ug.user_id = u.id AND ug.status <> 'wishlist'
  WHERE f.follower_id = $1 AND u.is_public
  GROUP BY u.username, f.created_at
  ORDER BY f.created_at DESC
`

export async function listFollowing(userId) {
  const { rows } = await query(FOLLOWING_SUMMARY, [userId])
  return rows.map((row) => ({
    username: row.username,
    followedAt: Date.parse(row.followed_at),
    total: row.total,
    hours: row.hours,
    completed: row.completed,
    playing: row.playing,
  }))
}

export async function follow(userId, username) {
  const { rows } = await query('SELECT id, is_public FROM users WHERE lower(username) = lower($1)', [
    username,
  ])

  const target = rows[0]
  if (target?.id === userId) return { error: 'self' }
  if (!target || !target.is_public) return { error: 'notFound' }

  await query(
    `INSERT INTO follows (follower_id, following_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [userId, target.id]
  )
  return { ok: true }
}

export async function unfollow(userId, username) {
  const { rows } = await query('SELECT id FROM users WHERE lower(username) = lower($1)', [username])
  if (!rows.length) return { error: 'notFound' }

  await query('DELETE FROM follows WHERE follower_id = $1 AND following_id = $2', [
    userId,
    rows[0].id,
  ])
  return { ok: true }
}

export async function isFollowing(userId, username) {
  const { rows } = await query(
    `SELECT 1 FROM follows f
     JOIN users u ON u.id = f.following_id
     WHERE f.follower_id = $1 AND lower(u.username) = lower($2)`,
    [userId, username]
  )
  return rows.length > 0
}
