import { createContext, useContext, useState, useEffect } from "react";

import axiosInstance from "../lib/axios";

import toast from "react-hot-toast";
import AI_logo from '../assets/AI_logo.png'
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

const AI_USER = {
  _id: "ai-assistant",
  name: "Namaste AI",
  email: "namasteai@quickchat.com",
  profileimg: AI_logo,
  isAI: true,
};

export const ChatProvider = ({ children }) => {

  const [messages, setMessages] = useState([]);

  const [aiMessages, setAiMessages] = useState([]);
  
  const [chats, setChats] = useState([]);

  const [chatPartners, setChatPartners] = useState([]);

  const [newContacts, setNewContacts] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [activeTab, setActiveTab] = useState("all");

  const [unreadCounts, setUnreadCounts] = useState({});

  const [isUserLoading, setIsUserLoading] = useState(false);

  const [isMessageLoading, setIsMessageLoading] = useState(false);

  const [isTyping, setIsTyping] = useState(false);

  const [isAllTyping, setIsAllTyping] = useState(false);

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

      setChatPartners([AI_USER, ...chatPartners]);

      setNewContacts(newContacts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching contacts");
    } finally {
      setIsUserLoading(false);
    }
  };

 const openAIChat = () => {
   setSelectedUser(AI_USER);
  };
  
  const getMessages = async (userId) => {
    if (selectedUser?.isAI) return;

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
 
 const clearChat = async () => {
   try {
     if (!selectedUser) return;

     if (selectedUser.isAI) {
       setAiMessages([]);

       try {
         await axiosInstance.delete("/ai/conversation/default-ai-chat");
       } catch (err) {
         console.log(err);
       }

       toast.success("AI chat cleared");
       return;
     }

     await axiosInstance.delete(`/messages/clear/${selectedUser._id}`);

     setMessages([]);

     await getContactsData();

     toast.success("Chat cleared");
   } catch (error) {
     console.error(error);

     toast.error("Failed to clear chat");
   }
 };
 const deleteChat = async () => {
   try {
     if (!selectedUser) return;

     // For AI chat
    if (selectedUser.isAI) {
  setAiMessages([]);

  setSelectedUser(null);

  toast.success("AI chat deleted");

  return;
}

     // For normal users
     setMessages([]);

     setChatPartners((prev) =>
       prev.filter((user) => user._id !== selectedUser._id),
     );

     setSelectedUser(null);

     toast.success("Chat deleted");
   } catch (error) {
     console.error(error);

     toast.error("Failed to delete chat");
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

       const receiver = chats.find((user) => user._id === receiverId);

       if (receiver) {
         setChatPartners((prev) => {
           const filtered = prev.filter((u) => u._id !== receiver._id);

           return [receiver, ...filtered];
         });
       }
     }
    } catch (error) {
      console.log("sendMessage error:", error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };
const sendAIMessage = async (content) => {
  try {
    const userMessage = {
      _id: crypto.randomUUID(),
      senderId: authUser._id,
      content,
      createdAt: new Date(),
    };

    setAiMessages((prev) => [...prev, userMessage]);

    setIsAllTyping(true);

    const res = await axiosInstance.post("/ai/chat", {
      message: content,
      conversationId: "default-ai-chat",
    });

    const aiMessage = {
      _id: crypto.randomUUID(),
      senderId: "ai-assistant",
      content: res.data.reply || "No response",
      createdAt: new Date(),
    };

    setAiMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.log("AI ERROR:", error.response?.data);

    toast.error(
      error.response?.data?.message || "AI service is temporarily unavailable",
    );
  } finally {
    setIsAllTyping(false);
  }
  };
  const currentMessages = selectedUser?.isAI ? aiMessages : messages;
  useEffect(() => {
    if (!selectedUser?._id) return;

    if (selectedUser.isAI) return;

    getMessages(selectedUser._id);
  }, [selectedUser]);
  useEffect(() => {
    if (!socket) return;

  socket.on("newMessage", (newMessage) => {
    const normalizedMessage = normalizeMessage(newMessage);

    const incomingSenderId = normalizedMessage.senderId;

    const senderUser = chats.find((u) => u._id === incomingSenderId);

    if (senderUser) {
      setChatPartners((prev) => {
        const filtered = prev.filter((u) => u._id !== senderUser._id);

        return [senderUser, ...filtered];
      });
    }

    const isActiveChat =
      incomingSenderId?.toString() === selectedUser?._id?.toString();

    if (isActiveChat) {
      setMessages((prev) => [...prev, normalizedMessage]);
    } else {
      setUnreadCounts((prev) => ({
        ...prev,
        [incomingSenderId]: (prev[incomingSenderId] || 0) + 1,
      }));
    }
  });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedUser]);

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
        messages: currentMessages,
        setMessages,
        setAiMessages,
        selectedUser,
        unreadCounts,
        activeTab,
        isUserLoading,
        isMessageLoading,
        isTyping,
        isAllTyping,

        sendAIMessage,
        openAIChat,

        clearChat,
        deleteChat,

        setMessages,
        setSelectedUser,
        selectUser: setSelectedUser,
        setActiveTab,

        sendMessage,
        getMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);