import { useEffect } from "react";

import { useAuth } from "../context/AuthContext.jsx";

import { useNavigate, useParams } from "react-router-dom";

import ChatContainer from "../components/Chat/ChatContainer.jsx";

import MinSideBar from "../components/Sidebar/MinSideBar";

import SideBar from "../components/Sidebar/SideBar";

import { useChat } from "../context/ChatContext";

export default function ChatPage() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const { user_id } = useParams();

  const {
    selectedUser,
    setSelectedUser,
    chatPartners,
    getMessages,
    unreadCounts,
    markAsRead,
  } = useChat();

  useEffect(() => {
    if (!user_id || chatPartners.length === 0) {
      setSelectedUser(null);

      return;
    }

    const user = chatPartners.find((u) => u._id === user_id);

    if (!user) return;

    setSelectedUser(user);

    getMessages(user_id);

    if (unreadCounts[user_id] > 0) {
      markAsRead(user_id);
    }
  }, [user_id, chatPartners]);

  useEffect(() => {
    const handleBackButton = () => {
      if (selectedUser) {
        navigate("/chat");
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [selectedUser]);

  return (
    <div className="h-screen w-full overflow-hidden flex bg-linear-to-br from-[#de3c62] via-[#4a0322] to-[#730505] text-white">
      {/* Mini Sidebar */}
      <div className="hidden md:flex flex-col w-30 lg:w-30 border-r border-[#343636] shrink-0">
        <MinSideBar />
      </div>

      {/* Sidebar */}
      <div
        className={`${
          selectedUser ? "hidden md:flex" : "flex"
        } w-full md:w-90 lg:w-100 shrink-0`}
      >
        <SideBar />
      </div>

      {/* Chat Container */}
      <div
        className={`${selectedUser ? "flex" : "hidden md:flex"} flex-1 min-w-0`}
      >
        <ChatContainer />
      </div>
    </div>
  );
}
