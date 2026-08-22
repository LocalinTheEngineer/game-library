import pg from 'pg'
import 'dotenv/config'

// Barındırılan veritabanları TLS istiyor; yerel kurulumda gerekmiyor.
const needsSsl = /neon\.tech|render\.com|supabase|amazonaws/.test(process.env.DATABASE_URL || '')

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
})

pool.on('error', (err) => {
  console.error('Unexpected database error', err)
})

export function query(text, params) {
  return pool.query(text, params)
}

// Birden fazla sorgunun ya hep ya hiç çalışması gerektiği yerlerde kullanılır.
export async function transaction(run) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await run(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export function close() {
  return pool.end()
}
