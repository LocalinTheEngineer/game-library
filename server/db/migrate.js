import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { query, close } from './pool.js'

const here = dirname(fileURLToPath(import.meta.url))

try {
  const sql = await readFile(join(here, 'schema.sql'), 'utf8')
  await query(sql)
  console.log('schema applied')
  console.log('register an account in the app to get started')
} catch (err) {
  console.error(err.message)
  process.exitCode = 1
} finally {
  await close()
}
