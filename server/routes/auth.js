import { Router } from 'express'
import { createUser, authenticate, findUser } from '../users.js'
import { signToken, requireAuth } from '../auth.js'
import { validateCredentials, validateRegistration } from '../validate.js'

const router = Router()

router.post('/register', async (req, res, next) => {
  const { data, errors } = validateRegistration(req.body)
  if (errors) return res.status(400).json({ errors })

  try {
    const user = await createUser(data)
    res.status(201).json({ user, token: signToken(user) })
  } catch (err) {
    if (err.code === '23505') {
      const field = err.constraint === 'users_username_key' ? 'username' : 'email'
      return res.status(409).json({ error: `That ${field} is already taken` })
    }
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  const { data, errors } = validateCredentials(req.body)
  if (errors) return res.status(400).json({ errors })

  try {
    const user = await authenticate(data.email, data.password)
    if (!user) return res.status(401).json({ error: 'Email or password is incorrect' })

    res.json({ user, token: signToken(user) })
  } catch (err) {
    next(err)
  }
})

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await findUser(req.userId)
    if (!user) return res.status(401).json({ error: 'Sign in to continue' })
    res.json(user)
  } catch (err) {
    next(err)
  }
})

export default router
