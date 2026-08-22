import { query, transaction } from './db/pool.js'
import { DEMO_USER } from './seed.js'

// v5'te oturum açan kullanıcıdan gelecek. Şimdilik tek hesap var.
let cachedUserId = null

async function currentUserId() {
  if (cachedUserId) return cachedUserId

  const { rows } = await query('SELECT id FROM users WHERE email = $1', [DEMO_USER.email])
  if (!rows.length) {
    throw new Error('Demo user is missing. Run "npm run db:migrate" first.')
  }

  cachedUserId = rows[0].id
  return cachedUserId
}

// Veritabanı sütun adları ile API alan adları birebir aynı değil,
// çeviriyi tek yerde yapıyoruz.
function toApi(row) {
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
    notes: row.notes,
    addedAt: Date.parse(row.added_at),
  }
}

const SELECT_ENTRY = `
  SELECT ug.id, g.name, g.genre, g.platform, g.cover_image, g.release_year,
         ug.status, ug.hours_played, ug.rating, ug.notes, ug.added_at
  FROM user_games ug
  JOIN games g ON g.id = ug.game_id
`

// Kapak ve yıl sadece dolu geldiyse güncellenir, aksi halde eldeki veri korunur.
async function upsertGame(client, { name, genre, platform, coverImage, releaseYear }) {
  const { rows } = await client.query(
    `INSERT INTO games (name, genre, platform, cover_image, release_year)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (lower(name))
     DO UPDATE SET
       genre = EXCLUDED.genre,
       platform = EXCLUDED.platform,
       cover_image = COALESCE(EXCLUDED.cover_image, games.cover_image),
       release_year = COALESCE(EXCLUDED.release_year, games.release_year)
     RETURNING id`,
    [name, genre, platform, coverImage, releaseYear]
  )
  return rows[0].id
}

export async function listGames() {
  const userId = await currentUserId()
  const { rows } = await query(
    `${SELECT_ENTRY} WHERE ug.user_id = $1 ORDER BY ug.added_at DESC`,
    [userId]
  )
  return rows.map(toApi)
}

export async function findGame(id) {
  const userId = await currentUserId()
  const { rows } = await query(`${SELECT_ENTRY} WHERE ug.id = $1 AND ug.user_id = $2`, [id, userId])
  return rows.length ? toApi(rows[0]) : null
}

export async function createGame(fields) {
  const userId = await currentUserId()

  return transaction(async (client) => {
    const gameId = await upsertGame(client, fields)

    const { rows } = await client.query(
      `INSERT INTO user_games (user_id, game_id, status, hours_played, rating, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [userId, gameId, fields.status, fields.hours, fields.rating, fields.notes]
    )

    const created = await client.query(`${SELECT_ENTRY} WHERE ug.id = $1`, [rows[0].id])
    return toApi(created.rows[0])
  })
}

export async function updateGame(id, fields) {
  const userId = await currentUserId()

  return transaction(async (client) => {
    const owned = await client.query('SELECT id FROM user_games WHERE id = $1 AND user_id = $2', [
      id,
      userId,
    ])
    if (!owned.rows.length) return null

    const gameId = await upsertGame(client, fields)

    await client.query(
      `UPDATE user_games
       SET game_id = $1, status = $2, hours_played = $3, rating = $4, notes = $5, updated_at = now()
       WHERE id = $6`,
      [gameId, fields.status, fields.hours, fields.rating, fields.notes, id]
    )

    const updated = await client.query(`${SELECT_ENTRY} WHERE ug.id = $1`, [id])
    return toApi(updated.rows[0])
  })
}

export async function removeGame(id) {
  const userId = await currentUserId()
  const { rowCount } = await query('DELETE FROM user_games WHERE id = $1 AND user_id = $2', [
    id,
    userId,
  ])
  return rowCount > 0
}
