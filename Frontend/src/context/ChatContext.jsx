import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  const getMyChatPartners = async () => {
    setIsUserLoading(true);
    try {
      const res = await axiosInstance.get("/messages/contacts");
      setChats(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching contacts");
    }
    finally {
      setIsUserLoading(false);
    }
  };
  const getAllContacts = async () => {
    setIsUserLoading(true);
    try {
      const res = await axiosInstance.get("/messages/contacts");
      setChats(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching contacts");
    } finally {
      setIsUserLoading(false);
    }
  };
  const fetchUnreadCounts = async () => {
    try {
      const res = await axiosInstance.get("/messages/unread-per-chat");
      const map = {};
      res.data.forEach((item) => {
        map[item._id] = item.count;
      });
      setUnreadCounts(map);
    } catch (error) {
      console.log("Error fetching unread counts");
    }
  };
  const getMessages = async (userId) => {
    setIsMessageLoading(true);
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      setMessages(res.data);
    } catch (error) {
      toast.error("Error fetching messages");
    } finally {
      setIsMessageLoading(false);
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
      console.log("Error marking as read");
    }
  };
  const selectUser = async (user) => {
    setSelectedUser(user);
    await getMessages(user._id);
    if (unreadCounts[user._id] > 0) {
      await markAsRead(user._id);
    }
  };
  useEffect(() => {
    getAllContacts();
    fetchUnreadCounts();
  }, []);
  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        activeTab,
        setActiveTab,
        selectedUser,
        selectUser,
        unreadCounts,
        isUserLoading,
        isMessageLoading,
        getMyChatPartners,
      }}
    > 
      {children}
    </ChatContext.Provider>
  );
};
export const useChat = () => useContext(ChatContext);