import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import jwt from 'jsonwebtoken'

const scrypt = promisify(scryptCallback)
const KEY_LENGTH = 64
const TOKEN_TTL = '7d'

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derived = await scrypt(password, salt, KEY_LENGTH)
  return `${salt}:${derived.toString('hex')}`
}

export async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false

  const derived = await scrypt(password, salt, KEY_LENGTH)
  const expected = Buffer.from(hash, 'hex')

  // Karşılaştırma süresi şifreye göre değişmesin diye sabit zamanlı kontrol.
  return expected.length === derived.length && timingSafeEqual(expected, derived)
}

export function signToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  })
}

export function requireAuth(req, res, next) {
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) return res.status(401).json({ error: 'Sign in to continue' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.sub
    next()
  } catch {
    res.status(401).json({ error: 'Your session has expired' })
  }
}
