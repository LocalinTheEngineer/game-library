import { Router } from 'express'
import { findPublicProfile } from '../profiles.js'

const router = Router()

router.get('/:username', async (req, res, next) => {
  try {
    const profile = await findPublicProfile(req.params.username)

    // Gizli profil ile olmayan profil aynı yanıtı veriyor; hesabın
    // var olup olmadığı dışarıdan anlaşılmasın.
    if (!profile) return res.status(404).json({ error: 'No public profile here' })

    res.json(profile)
  } catch (err) {
    next(err)
  }
})

export default router
