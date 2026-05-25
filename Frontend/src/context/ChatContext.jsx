import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [chatPartners, setChatPartners] = useState([]);
  const [newContacts, setNewContacts] = useState([]);

  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [activeTab, setActiveTab] = useState("all");
  const [unreadCounts, setUnreadCounts] = useState({});

  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
const [isTyping, setIsTyping] = useState(false);
  const { authUser, socket } = useAuth();

  const getContactsData = async () => {
    setIsUserLoading(true);
    try {
      const res = await axiosInstance.get("/messages/contacts-data");
      const { allUsers, chatPartners, newContacts } = res.data;
      setChats(allUsers);
      setChatPartners(chatPartners);
      setNewContacts(newContacts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching contacts");
    } finally {
      setIsUserLoading(false);
    }
  };

  const getMessages = async (userId) => {
    setIsMessageLoading(true);
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      setMessages(res.data.messages);
    } catch {
      toast.error("Error fetching messages");
    } finally {
      setIsMessageLoading(false);
    }
  };

  const sendMessage = async ({ content, receiverId, file }) => {
    try {
      const formData = new FormData();

      formData.append("content", content || "");

      formData.append("receiverId", receiverId);

      if (file) {
        formData.append("file", file);
      }

      const res = await axiosInstance.post("/messages/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data) {
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (error) {
      console.log("sendMessage error:", error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const markAsRead = async (userId) => {
    try {
      await axiosInstance.put(`/messages/mark-read/${userId}`);
      setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));
    } catch {}
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    await getMessages(user._id);
    if (unreadCounts[user._id] > 0) {
      await markAsRead(user._id);
    }
  };

  const handleIncomingMessage = (newMessage) => {
    const isActiveChat = selectedUser?._id === newMessage.senderId;

    if (isActiveChat) {
      setMessages((prev) => [...prev, newMessage]);
      if (unreadCounts[newMessage.senderId] > 0) {
        markAsRead(newMessage.senderId);
      }
    } else {
      setUnreadCounts((prev) => ({
        ...prev,
        [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
      }));
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", handleIncomingMessage);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
    };
  }, [socket, selectedUser, unreadCounts]);

  useEffect(() => {
    if (authUser) {
      getContactsData();
    }
  }, [authUser]);
  useEffect(() => {
    if (!socket) return;

    socket.on("typing", ({ senderId }) => {
      if (selectedUser?._id === senderId) {
        setIsTyping(true);
      }
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (selectedUser?._id === senderId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket, selectedUser]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        chatPartners,
        newContacts,
        messages,
        selectedUser,
        unreadCounts,
        activeTab,
        isUserLoading,
        isTyping,
        isMessageLoading,
        setActiveTab,
        selectUser,
        sendMessage,
        getMessages,
        markAsRead,
        getContactsData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);