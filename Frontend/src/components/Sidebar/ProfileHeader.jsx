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
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-red-400 via-pink-400 to-red-600 bg-clip-text text-transparent tracking-wide">
              QuickChat
            </h1>

            <p className="text-zinc-500 text-sm">Real-time conversations</p>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">
          {/* New Chat */}
          <button
            onClick={() => setShowContacts(true)}
            className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg shadow-red-900/40 transition-all duration-300"
          >
            <MessageSquarePlus size={20} className="text-white" />
          </button>
          <button
            onClick={() => setShowProfile(true)}
            className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300"
          >
            <Settings
              size={19}
              className="text-zinc-300 group-hover:text-red-300 transition"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
