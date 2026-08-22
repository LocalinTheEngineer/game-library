import { Router } from 'express'
import { listGames, findGame, createGame, updateGame, removeGame } from '../store.js'
import { validateGame } from '../validate.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    res.json(await listGames())
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const game = await findGame(req.params.id)
    if (!game) return res.status(404).json({ error: 'Game not found' })
    res.json(game)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  const { game, errors } = validateGame(req.body)
  if (errors) return res.status(400).json({ errors })

  try {
    res.status(201).json(await createGame(game))
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  const { game, errors } = validateGame(req.body)
  if (errors) return res.status(400).json({ errors })

  try {
    const updated = await updateGame(req.params.id, game)
    if (!updated) return res.status(404).json({ error: 'Game not found' })
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await removeGame(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Game not found' })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
