import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { signup, login ,logout,updateProfile} from '../controllers/auth.controller.js'
const router = express.Router()
router.post('/signup', signup)
router.post('/',login)
router.put('/update-profile', protectRoute, updateProfile)
router.post('/logout', logout)
router.get("/check", protectRoute, (req, res) => {
    res.status(200).json(req.user)
    
})

export default router;