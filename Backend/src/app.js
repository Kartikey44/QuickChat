import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoute from './routes/auth.routes.js';
import messageRoute from './routes/message.routes.js';
import uploadRoute from './routes/upload.routes.js';

import connecttodb from './config/db.js';

dotenv.config();

const app = express();
connecttodb();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/messages', messageRoute);
app.use('/api', uploadRoute);

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;