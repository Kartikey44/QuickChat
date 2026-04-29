import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UnreadChats from '../components/UnreadChats'
import AllChats from "../components/AllChats";
import ProfileOverlay from "../components/ProfileOverlay";
import ChatContainer from "../components/ChatContainer";
import NoChatContainer from "../components/NoChatContainer";
import ProfileHeader from "../components/ProfileHeader";
import { useChat } from "../context/ChatContext";
import MinSideBar from "../components/MinSideBar";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import SideBar from "../components/SideBar";

export default function ChatPage() {
  const [showProfile, setShowProfile] = useState(false);

  const { logout, authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();
  const { selectedUser,activeTab } = useChat();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      console.log("Logout failed");
    }
  };

  return (
    <div className="h-screen w-full bg-[#161717] text-white flex overflow-hidden">
      {/* MinSidebar */}
      <div className=" hidden md:flex flex-col w-15 border-r border-[#343636]">
        <MinSideBar setShowProfile={setShowProfile} />
      </div>

      <div className="flex flex-1">
        {/* Left Panel */}
        <SideBar/>
        {/* Right Panel */}
        <div className="hidden md:flex flex-1">
          {selectedUser ? <ChatContainer /> : <NoChatContainer />}
        </div>
      </div>
    </div>
  );
}
