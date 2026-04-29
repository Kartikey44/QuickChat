import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

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
  
const getMessages = async (userId) => {
  setIsMessageLoading(true);
  try {
    const res = await axiosInstance.get(`/messages/${userId}`);

    setMessages(res.data.messages);
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
const sendMessage = async ({ content, receiverId, image }) => {
  try {
    const formData = new FormData();

    formData.append("content", content);
    formData.append("receiverId", receiverId);

    if (image) {
      formData.append("image", image); 
    }
    console.log("image being sent",image);
    const res = await axiosInstance.post("/messages/send", formData);

    setMessages((prev) => [...prev, res.data]);
  } catch (error) {
    console.log("sendMessage error:", error.response?.data || error.message);
  }
};
  const selectUser = async (user) => {
    setSelectedUser(user);
    await getMessages(user._id);
    if (unreadCounts[user._id] > 0) {
      await markAsRead(user._id);
    }
  };
 const { authUser } = useAuth();

 useEffect(() => {
   if (authUser) {
     getMyChatPartners();
   }
 }, [authUser]);
  return (
    <ChatContext.Provider
      value={{
        chats,
        sendMessage,
        activeTab,
        selectedUser,
        getMessages,
        messages,
        unreadCounts,
        isUserLoading,
        isMessageLoading,
        setActiveTab,
        selectUser,
        getMyChatPartners,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const useChat = () => useContext(ChatContext);