import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const cookie = socket.handshake.headers.cookie;

    if (!cookie) {
      return next(new Error("No cookie"));
    }

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return next(new Error("No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId || decoded._id;

    if (!userId) {
      return next(new Error("Invalid token"));
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.log("Socket auth error:", error.message);

    next(new Error("Auth failed"));
  }
};