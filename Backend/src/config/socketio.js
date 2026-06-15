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

// userId -> socketId
const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  try {
    const user = socket.user;

    if (!user) {
      socket.disconnect();
      return;
    }

    const userId = user._id.toString();

    // Store connected user
    userSocketMap[userId] = socket.id;

    console.log(`User Connected: ${user.name} (${userId})`);

    // Broadcast online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    /* ==========================
       Typing Events
    ========================== */

    socket.on("typing", ({ receiverId }) => {
      const receiverSocketId =
        getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", {
          senderId: userId,
        });
      }
    });

    socket.on("stopTyping", ({ receiverId }) => {
      const receiverSocketId =
        getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", {
          senderId: userId,
        });
      }
    });

    /* ==========================
       Chat Partner Update
    ========================== */

    socket.on("chatPartnerAdded", (partner) => {
      const receiverSocketId =
        getReceiverSocketId(partner._id);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "chatPartnerAdded",
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileimg: user.profileimg,
          }
        );
      }
    });

    /* ==========================
       Disconnect
    ========================== */

    socket.on("disconnect", () => {
      delete userSocketMap[userId];

      console.log(
        `User Disconnected: ${user.name} (${userId})`
      );

      io.emit(
        "getOnlineUsers",
        Object.keys(userSocketMap)
      );
    });
  } catch (error) {
    console.error("Socket Error:", error);
  }
});