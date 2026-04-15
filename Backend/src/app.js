import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import authRoute from './routes/auth.routes.js'
import messageRoute from './routes/message.routes.js'
import cookieParser from 'cookie-parser';
import connecttodb from './lib/db.js';
dotenv.config()
const app = express()
connecttodb()
app.use(cors({
  origin: [
    "process.env.VITE_ORIGIN",
    "https://quick-chat-tawny-eta.vercel.app/"
  ],
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api/auth', authRoute)
app.use('/api/messages', messageRoute)
export default app;