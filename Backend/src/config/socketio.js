import { Server } from "socket.io";
import http from "http";
import app from "../app.js";
import { socketAuthMiddleware } from "../middleware/socket.middleware.js";

export const server = http.createServer(app);

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as
      // certain server-to-server or native-client requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed"));
    },
    credentials: true,
  },
});

// userId -> Set of socket IDs
const userSocketMap = new Map();

const normalizeUserId = (userId) => {
  if (typeof userId !== "string") {
    return null;
  }

  const normalizedId = userId.trim();

  if (!normalizedId || normalizedId.length > 128) {
    return null;
  }

  return normalizedId;
};

// Maintained for compatibility with existing controllers.
// Returns one socket ID if the user is online.
export const getReceiverSocketId = (userId) => {
  const normalizedId = String(userId ?? "");
  const socketIds = userSocketMap.get(normalizedId);

  if (!socketIds || socketIds.size === 0) {
    return undefined;
  }

  return [...socketIds].at(-1);
};

// Returns all active socket IDs belonging to a user.
export const getReceiverSocketIds = (userId) => {
  const normalizedId = String(userId ?? "");

  return [...(userSocketMap.get(normalizedId) ?? [])];
};

// Send an event to all of a user's connected devices.
export const emitToUser = (userId, event, payload) => {
  const normalizedId = normalizeUserId(String(userId ?? ""));

  if (!normalizedId) {
    return;
  }

  // Every authenticated user's sockets join their userId room.
  io.to(normalizedId).emit(event, payload);
};

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  const user = socket.user;

  if (!user?._id) {
    socket.disconnect(true);
    return;
  }

  const userId = String(user._id);

  // Join a room shared by all of this user's connections.
  socket.join(userId);

  // Track each active connection independently.
  let socketIds = userSocketMap.get(userId);

  if (!socketIds) {
    socketIds = new Set();
    userSocketMap.set(userId, socketIds);
  }

  socketIds.add(socket.id);

  console.log(`User Connected: ${user.name ?? userId} (${userId})`);

  io.emit("getOnlineUsers", [...userSocketMap.keys()]);

  /* ==========================
     Typing Events
  ========================== */

  socket.on("typing", (payload) => {
    const receiverId = normalizeUserId(payload?.receiverId);

    if (!receiverId || receiverId === userId) {
      return;
    }

    emitToUser(receiverId, "typing", {
      senderId: userId,
    });
  });

  socket.on("stopTyping", (payload) => {
    const receiverId = normalizeUserId(payload?.receiverId);

    if (!receiverId || receiverId === userId) {
      return;
    }

    emitToUser(receiverId, "stopTyping", {
      senderId: userId,
    });
  });

  /* ==========================
     Chat Partner Update
  ========================== */

  socket.on("chatPartnerAdded", (partner) => {
    const partnerId = normalizeUserId(partner?._id);

    if (!partnerId || partnerId === userId) {
      return;
    }

    /*
     * IMPORTANT:
     * Before emitting, verify server-side that this user
     * is authorized to add this chat partner.
     *
     * Prefer emitting this event from the authenticated
     * controller after the relationship is saved and
     * verified in the database.
     */

    emitToUser(partnerId, "chatPartnerAdded", {
      _id: userId,
      name: user.name,
      email: user.email,
      profileimg: user.profileimg,
    });
  });

  /* ==========================
     Disconnect
  ========================== */

  socket.on("disconnect", (reason) => {
    const activeSockets = userSocketMap.get(userId);

    if (activeSockets) {
      // Remove only this particular connection.
      activeSockets.delete(socket.id);

      // Mark offline only after the last connection closes.
      if (activeSockets.size === 0) {
        userSocketMap.delete(userId);

        io.emit("getOnlineUsers", [...userSocketMap.keys()]);

        console.log(`User Offline: ${user.name ?? userId} (${userId})`);
      } else {
        console.log(
          `Socket Disconnected: ${user.name ?? userId}; ` +
            `${activeSockets.size} connection(s) remaining`,
        );
      }
    }

    console.log(`Socket disconnected: ${reason}`);
  });
});