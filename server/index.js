import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import games from './routes/games.js'
import search from './routes/search.js'
import auth from './routes/auth.js'
import { query } from './db/pool.js'

const app = express()
const port = process.env.PORT || 4000

// Yayında sadece kendi arayüzümüzden gelen isteklere izin veriyoruz.
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean)
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : {}))
app.use(express.json())

app.use('/api/auth', auth)
app.use('/api/games', games)
app.use('/api/search', search)

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1')
    res.json({ ok: true, database: 'up' })
  } catch {
    res.status(503).json({ ok: false, database: 'down' })
  }
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
  console.error(err)

  // Aynı oyunu iki kez eklemeye çalışmak şema seviyesinde engelleniyor.
  if (err.code === '23505') {
    return res.status(409).json({ error: 'That game is already in your library' })
  }

  res.status(500).json({ error: 'Something went wrong' })
})

for (const name of ['DATABASE_URL', 'JWT_SECRET']) {
  if (!process.env[name]) {
    console.error(`${name} is not set. Copy .env.example to .env and fill it in.`)
    process.exit(1)
  }
}

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
