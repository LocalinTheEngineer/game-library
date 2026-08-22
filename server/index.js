import express from 'express'
import cors from 'cors'
import games from './routes/games.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/games', games)

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
