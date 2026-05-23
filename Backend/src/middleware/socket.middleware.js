import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const cookie = socket.handshake.headers.cookie;

    if (!cookie) return next(new Error("No cookie"));

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return next(new Error("User not found"));

    socket.user = user;

    next();
  } catch {
    next(new Error("Auth failed"));
  }
};