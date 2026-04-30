// src/lib/socket.js
import { Server } from "socket.io";
import http from "http";
import app from "../app.js";
import { socketAuthMiddleware } from "../middleware/socket.middleware.js";

export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const userSocketMap = {};

io.on("connection", (socket) => {
  const user = socket.user;
  const userId = user._id.toString();

  console.log("✅ Connected:", user.fullName);

  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", user.fullName);

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});