import { Router } from 'express'
import { findPublicProfile } from '../profiles.js'
import { isFollowing } from '../follows.js'
import jwt from 'jsonwebtoken'

const router = Router()

// Profil herkese açık, ama giriş yapan biri bakıyorsa takip durumunu da
// döndürebilmek için jetonu varsa okuyoruz.
function optionalUserId(req) {
  const header = req.get('authorization') || ''
  if (!header.startsWith('Bearer ')) return null

  try {
    return jwt.verify(header.slice(7), process.env.JWT_SECRET).sub
  } catch {
    return null
  }
}

router.get('/:username', async (req, res, next) => {
  try {
    const profile = await findPublicProfile(req.params.username)

    // Gizli profil ile olmayan profil aynı yanıtı veriyor; hesabın
    // var olup olmadığı dışarıdan anlaşılmasın.
    if (!profile) return res.status(404).json({ error: 'No public profile here' })

    const viewerId = optionalUserId(req)
    const following = viewerId ? await isFollowing(viewerId, profile.username) : false

    res.json({ ...profile, following, isSelf: viewerId === profile.id })
  } catch (err) {
    next(err)
  }
})

export default router
