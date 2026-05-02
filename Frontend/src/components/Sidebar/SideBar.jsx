import React, { useState } from "react";
import ChatPartners from "../ChatPartners";
import UnreadChats from "../Chat/UnreadChats";
import ProfileOverlay from "../Sidebar/ProfileOverlay";
import ContactOverlay from "../Contact/ContactOverlay";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import ProfileHeader from "../Sidebar/ProfileHeader";
import { useData } from "../../context/DataContext";
function SideBar() {
  const { showProfile, setShowProfile, showContacts } = useData();
  const { activeTab } = useChat();
  const { logout, authUser, setAuthUser } = useAuth();

  return (
    <div className="w-full md:w-100 border-r border-[#343636] flex flex-col relative">
      <div className="p-4">
        <ProfileHeader />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === "all" ? <ChatPartners /> : <UnreadChats />}
      </div>
      {showProfile && <ProfileOverlay />}
      {showContacts && <ContactOverlay />}
    </div>
  );
}

export default SideBar;
