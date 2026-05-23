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

      setAuthUser(res.data.user);
    } catch (error) {
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const connectSocket = (user) => {
    if (!user) return;

    if (socket?.connected) return;

    const newSocket = io(BASE_URL, {
      withCredentials: true,

      query: {
        userId: user.id,
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket Connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });

    setSocket(newSocket);
  };


  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    }
  };


  const signup = async (userData) => {
    setSigningUp(true);

    try {
      const res = await axiosInstance.post("/auth/signup", userData);

      setAuthUser(res.data.user);

      toast.success("Account created successfully!");

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setSigningUp(false);
    }
  };
  const login = async (userData) => {
    setLoggingIn(true);

    try {
      const res = await axiosInstance.post("/auth/", userData);

      setAuthUser(res.data.user);

      toast.success("Logged in successfully!");

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");

      disconnectSocket();

      setAuthUser(null);

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };



  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authUser) {
      connectSocket(authUser);
    } else {
      disconnectSocket();
    }
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
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
