import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import UnreadChats from "../components/Chat/UnreadChats.jsx";
import AllChats from "../components/AllChats";
import ProfileOverlay from "../components/Sidebar/ProfileOverlay";
import ChatContainer from "../components/Chat/ChatContainer.jsx";
import NoChatContainer from "../components/Chat/NoChatContainer.jsx";
import ProfileHeader from "../components/Sidebar/ProfileHeader.jsx";
import { useChat } from "../context/ChatContext";
import MinSideBar from "../components/Sidebar/MinSideBar";
import ActiveTabSwitch from "../components/Sidebar/ActiveTabSwitch";
import SideBar from "../components/Sidebar/SideBar";
import { useData } from "../context/DataContext.jsx";
export default function ChatPage() {
  const { showProfile, setShowProfile } = useData();

  const { logout, authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();
  const { selectedUser, activeTab } = useChat();

  const handleLogout = async () => {
    try {
      console.log("API URL:", import.meta.env.VITE_API_URL);
      await logout();
      navigate("/");
    } catch {
      console.log("Logout failed");
    }
  };

  return (
    <div className="h-screen w-full bg-linear-to-br from-[#de3c62] via-[#4a0322] to-[#730505] text-white flex overflow-hidden">
      {/* MinSidebar */}
      <div className=" hidden md:flex flex-col w-15 border-r border-[#343636]">
        <MinSideBar />
      </div>

      <div className="flex flex-1">
        {/* Left Panel */}
        <SideBar />
        {/* Right Panel */}
        <div className="hidden md:flex flex-1">
          {selectedUser ? <ChatContainer /> : <NoChatContainer />}
        </div>
      </div>
    </div>
  );
}
