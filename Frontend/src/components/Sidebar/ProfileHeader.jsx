import React, { useRef } from "react";
import { MessageSquarePlus, Bell, Settings } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

function ProfileHeader() {
  const { authUser } = useAuth();

  const { setShowContacts, setShowProfile } = useData();

  const fileInputRef = useRef(null);

  return (
    <div className="w-full flex flex-col gap-5">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* Branding */}
          <h1 className="text-3xl font-semibold text-red-700">
              Chats
            </h1>
          
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">
          {/* New Chat */}
          <button
            onClick={() => setShowContacts(true)}
            className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-linear-to-br from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 shadow-lg shadow-red-900/40 transition-all duration-300 cursor-pointer "
          >
            <MessageSquarePlus size={20} className="text-white" />
          </button>
          <button
            onClick={() => setShowProfile(true)}
            className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-gray-500/20 hover:border-gray-500/30 cursor-pointer transition-all duration-300"
          >
            <Settings
              size={19}
              className="text-zinc-300 group-hover:text-gray-300 cursor-pointer transition"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
