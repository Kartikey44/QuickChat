import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [signingUp, setSigningUp] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      setAuthUser(res.data);
    } catch {
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const connectSocket = (user) => {
    if (!user || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const signup = async (userData) => {
    setSigningUp(true);
    try {
      const res = await axiosInstance.post("/auth/signup", userData);
      setAuthUser(res.data);
      connectSocket(res.data);
      toast.success("Account created successfully!");
      return res.data;
    } finally {
      setSigningUp(false);
    }
  };

  const login = async (userData) => {
    setLoggingIn(true);
    try {
      const res = await axiosInstance.post("/auth/login", userData);
      setAuthUser(res.data);
      connectSocket(res.data);
      toast.success("Logged in successfully!");
      return res.data;
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setAuthUser(null);
      disconnectSocket();
      toast.success("Logged out successfully");
    } catch {}
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!authUser) disconnectSocket();
  }, [authUser]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        login,
        signup,
        logout,
        loggingIn,
        signingUp,
        isCheckingAuth,
        onlineUsers,
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
