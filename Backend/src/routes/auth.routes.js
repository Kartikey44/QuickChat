import express, { Router } from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { signup, login ,logout,updateProfile} from '../controllers/auth.controller.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'
const router = express.Router()
router.use(arcjetProtection)
router.post('/signup', signup)
router.post('/login',login)
router.put('/update-profile', protectRoute, updateProfile)
router.get('/logout', logout)
router.get("/check", protectRoute, (req, res) => {
    res.status(201).json(req.user)
})

export default router;