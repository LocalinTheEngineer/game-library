import { Router } from 'express'
import { listFollowing, follow, unfollow } from '../follows.js'
import { requireAuth } from '../auth.js'

const router = Router()

router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    res.json(await listFollowing(req.userId))
  } catch (err) {
    next(err)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const result = await follow(req.userId, req.params.username)

    if (result.error === 'self') {
      return res.status(400).json({ error: "You can't follow yourself" })
    }
    if (result.error) {
      return res.status(404).json({ error: 'No public profile here' })
    }

    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

router.delete('/:username', async (req, res, next) => {
  try {
    const result = await unfollow(req.userId, req.params.username)
    if (result.error) return res.status(404).json({ error: 'No public profile here' })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
