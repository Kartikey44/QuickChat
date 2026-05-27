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

  const normalizeMessage = (msg) => {
    return {
      ...msg,

      senderId: msg.senderId?._id || msg.senderId,

      receiverId: msg.receiverId?._id || msg.receiverId,
    };
  };

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

      const normalized = res.data.messages.map(normalizeMessage);

      setMessages(normalized);
    } catch (error) {
      console.log(error);

      toast.error("Error fetching messages");
    } finally {
      setIsMessageLoading(false);
    }
  };

  const sendMessage = async ({ content, receiverId, file, replyTo }) => {
    try {
      const formData = new FormData();

      formData.append("content", content || "");

      formData.append("receiverId", receiverId);

      if (replyTo) {
        formData.append("replyTo", replyTo);
      }

      if (file) {
        formData.append("file", file);
      }

      const res = await axiosInstance.post("/messages/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data) {
        const normalized = normalizeMessage(res.data);

        setMessages((prev) => [...prev, normalized]);

        // move active chat to top
        setChatPartners((prev) => {
          const updated = prev.map((user) =>
            user._id === receiverId
              ? {
                  ...user,
                  lastMessageTime: new Date().toISOString(),
                }
              : user,
          );

          return updated.sort(
            (a, b) =>
              new Date(b.lastMessageTime || 0) -
              new Date(a.lastMessageTime || 0),
          );
        });
      }
    } catch (error) {
      console.log("sendMessage error:", error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const editMessage = async (messageId, content) => {
    try {
      await axiosInstance.put(`/messages/edit/${messageId}`, {
        content,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                content,
                edited: true,
              }
            : msg,
        ),
      );

      toast.success("Message edited");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit");
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`);

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const markAsRead = async (userId) => {
    try {
      await axiosInstance.put(`/messages/mark-read/${userId}`);

      setUnreadCounts((prev) => ({
        ...prev,

        [userId]: 0,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
  };

  const clearChat = async () => {
    try {
      await axiosInstance.delete(`/messages/clear/${selectedUser._id}`);

      setMessages([]);

      toast.success("Chat cleared");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleIncomingMessage = (newMessage) => {
    const normalizedMessage = normalizeMessage(newMessage);

    const incomingSenderId = normalizedMessage.senderId;

    const isActiveChat =
      incomingSenderId?.toString() === selectedUser?._id?.toString();

    if (isActiveChat) {
      setMessages((prev) => [...prev, normalizedMessage]);

      if (unreadCounts[incomingSenderId] > 0) {
        markAsRead(incomingSenderId);
      }
    } else {
      setUnreadCounts((prev) => ({
        ...prev,

        [incomingSenderId]: (prev[incomingSenderId] || 0) + 1,
      }));
    }

    // reorder chats
    setChatPartners((prev) => {
      const updated = prev.map((user) =>
        user._id === incomingSenderId
          ? {
              ...user,
              lastMessageTime: new Date().toISOString(),
            }
          : user,
      );

      return updated.sort(
        (a, b) =>
          new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0),
      );
    });
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
      if (senderId?.toString() === selectedUser?._id?.toString()) {
        setIsTyping(true);
      }
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId?.toString() === selectedUser?._id?.toString()) {
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
        isMessageLoading,
        isTyping,

        clearChat,
        setActiveTab,

        selectUser,
        sendMessage,
        getMessages,
        markAsRead,
        setSelectedUser,
        getContactsData,

        editMessage,
        deleteMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const useChat = () => useContext(ChatContext);