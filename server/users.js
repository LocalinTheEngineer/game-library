import { query } from './db/pool.js'
import { hashPassword, verifyPassword } from './auth.js'

function toApi(row) {
  return { id: row.id, username: row.username, email: row.email, isPublic: row.is_public }
}

export async function createUser({ username, email, password }) {
  const passwordHash = await hashPassword(password)

  const { rows } = await query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, is_public`,
    [username, email.toLowerCase(), passwordHash]
  )

  return toApi(rows[0])
}

export async function authenticate(email, password) {
  const { rows } = await query(
    'SELECT id, username, email, is_public, password_hash FROM users WHERE lower(email) = lower($1)',
    [email]
  )

  // Kullanıcı yoksa da hash doğrulaması yapıyoruz; yanıt süresi
  // "bu e-posta kayıtlı mı" bilgisini sızdırmasın.
  const row = rows[0]
  const stored = row?.password_hash || 'x:0000'
  const valid = await verifyPassword(password, stored)

  return row && valid ? toApi(row) : null
}

export async function findUser(id) {
  const { rows } = await query('SELECT id, username, email, is_public FROM users WHERE id = $1', [
    id,
  ])
  return rows.length ? toApi(rows[0]) : null
}

export async function setVisibility(id, isPublic) {
  const { rows } = await query(
    'UPDATE users SET is_public = $1 WHERE id = $2 RETURNING id, username, email, is_public',
    [isPublic, id]
  )
  return rows.length ? toApi(rows[0]) : null
}
