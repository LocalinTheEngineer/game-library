import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { query, transaction, close } from './pool.js'
import { DEMO_USER, DEMO_LIBRARY } from '../seed.js'

const here = dirname(fileURLToPath(import.meta.url))

async function applySchema() {
  const sql = await readFile(join(here, 'schema.sql'), 'utf8')
  await query(sql)
  console.log('schema applied')
}

async function insertDemoData() {
  const { rows } = await query('SELECT count(*)::int AS count FROM user_games')
  if (rows[0].count > 0) {
    console.log('library already has rows, skipping demo data')
    return
  }

  await transaction(async (client) => {
    const user = await client.query(
      `INSERT INTO users (username, email)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username
       RETURNING id`,
      [DEMO_USER.username, DEMO_USER.email]
    )
    const userId = user.rows[0].id

    for (const entry of DEMO_LIBRARY) {
      const game = await client.query(
        `INSERT INTO games (name, genre, platform, release_year)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (lower(name)) DO UPDATE SET genre = EXCLUDED.genre
         RETURNING id`,
        [entry.name, entry.genre, entry.platform, entry.releaseYear]
      )

      await client.query(
        `INSERT INTO user_games (user_id, game_id, status, hours_played, rating, notes, added_at)
         VALUES ($1, $2, $3, $4, $5, $6, now() - ($7 || ' days')::interval)
         ON CONFLICT (user_id, game_id) DO NOTHING`,
        [
          userId,
          game.rows[0].id,
          entry.status,
          entry.hours,
          entry.rating,
          entry.notes,
          entry.daysAgo,
        ]
      )
    }
  })

  console.log(`inserted ${DEMO_LIBRARY.length} demo entries`)
}

try {
  await applySchema()
  await insertDemoData()
} catch (err) {
  console.error(err.message)
  process.exitCode = 1
} finally {
  await close()
}
