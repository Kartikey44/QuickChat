import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import authRoute from './routes/auth.routes.js'
import messageRoute from './routes/message.routes.js'
import uploadRoute from './routes/upload.routes.js'
import cookieParser from 'cookie-parser';
import connecttodb from './lib/db.js';
dotenv.config()
const app = express()
app.use(cors({
  origin: [
     process.env.FRONTEND_URL || process.env.VITE_ORIGIN 
  ],
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api/auth', authRoute)
app.use('/api/messages', messageRoute)
app.use('/api',uploadRoute)
export default app;