import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from '../assets/Logo.png'
import AllChats from "../components/AllChats";
import ChatContainer  from "../components/ChatContainer";
import NoChat from "../components/NoChat";
import UnreadChats from "../components/UnreadChats";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import { useChat } from "../context/ChatContext";
import SearchBar from "./SearchBar";
import MinSideBar from "../components/MinSideBar";
export default function ChatPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const {activeTab, selectedUser } = useChat();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log("Logout failed");
    }
  };

  return (
    <div className="max-w-screen mih-h-screen text-white ">
      <div className=" grid md:grid-cols-[0.50fr_9.50fr]">
        <MinSideBar/>
        <div className="min-h-screen grid grid-cols-[3.5fr] md:grid-cols-[3.5fr_7.5fr]  gap-5 w-full bg-black/90 ">
        <div className="md:px-3 px-1 flex flex-col gap-8 pt-5 border border-y-0 border-x-white/20">
           <ProfileHeader />
            <SearchBar/>
            <ActiveTabSwitch />
            <div>
              {activeTab === "all"?<AllChats/>:<UnreadChats/>}
            </div>
          </div>
          {/* chatcontainer */}
        <div className="md:flex hidden">
            {selectedUser? <ChatContainer/>:<NoChat/>}
        </div>
        </div>
        </div>
      </div>
  );
}