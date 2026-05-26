import React, { useState } from "react";
import ChatPartners from "../ChatPartners";
import UnreadChats from "../Chat/UnreadChats";
import ProfileOverlay from "../Sidebar/ProfileOverlay";
import ContactOverlay from "../Contact/ContactOverlay";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useData } from "../../context/DataContext";
import ProfileHeader from "../Sidebar/ProfileHeader";
import ChatSearchBar from "../Chat/ChatSearchBar";
import ActiveTabSwitch from "./ActiveTabSwitch";

function SideBar() {
  const { showProfile, setShowProfile, showContacts, setShowContacts } = useData();
  const { activeTab } = useChat();
  const { authUser } = useAuth();

  
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return (
    <div className="w-full md:w-100 border-r border-[#343636] flex flex-col relative bg-linear-to-br from-[#2a030a] via-[#400505] to-[#290000]">
      <div className="p-4 sticky top-0 z-10 ">
        <ProfileHeader />
      </div>
      <div className="flex flex-col gap-4 px-3 py-2">
        <ChatSearchBar onSearch={setSearchQuery} />
        <ActiveTabSwitch />
      </div>

      {/* 🔹 Chat List */}
      <div className="flex-1 overflow-y-auto px-2">
        {activeTab === "all" ? (
          <ChatPartners searchQuery={normalizedQuery} />
        ) : (
          <UnreadChats searchQuery={normalizedQuery} />
        )}
      </div>

      {/* 🔹 Overlays */}
      {showProfile && (
        <ProfileOverlay user={authUser} onClose={() => setShowProfile(false)} />
      )}

      {showContacts && (
        <ContactOverlay onClose={() => setShowContacts(false)} />
      )}
    </div>
  );
}

export default SideBar;