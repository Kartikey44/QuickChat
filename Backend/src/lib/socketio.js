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
  if (!socket.user) {
    socket.disconnect();
    return;
  }

  const userId = socket.user._id.toString();

  console.log("Connected:", socket.user.name);

  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.user.name);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});