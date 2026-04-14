import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'
import dotenv from 'dotenv'

dotenv.config()

export const protectRoute = async (req, res, next) => {
  try {
 const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
        success: false
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded._id).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      })
    }

    req.user = user
    next()

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false
    })
  }
}