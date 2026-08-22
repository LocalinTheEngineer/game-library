import { Router } from 'express'
import { searchGames } from '../rawg.js'

const router = Router()

router.get('/', async (req, res, next) => {
  const term = (req.query.q || '').toString()
  if (term.trim().length < 2) return res.json([])

  try {
    res.json(await searchGames(term))
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message })
    next(err)
  }
})

export default router
