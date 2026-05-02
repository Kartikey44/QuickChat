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

  const { authUser } = useAuth();

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
    } catch (error) {
      toast.error("Error fetching messages");
    } finally {
      setIsMessageLoading(false);
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

      const res = await axiosInstance.post("/messages/send", formData);

      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      console.log("sendMessage error:", error.response?.data || error.message);
      toast.error("Failed to send message");
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
    if (authUser) {
      getContactsData();
    }
  }, [authUser]);

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
