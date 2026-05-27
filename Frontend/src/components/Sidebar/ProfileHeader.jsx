import React, { useRef, useState, useEffect } from "react";
import { MessageSquarePlus, Settings, User, LogOut } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

function ProfileHeader() {
  const { authUser, logout } = useAuth();

  const { setShowContacts, setShowProfile } = useData();

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-semibold text-red-700">Chats</h1>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 relative">
          {/* New Chat */}
          <button
            onClick={() => setShowContacts(true)}
            className="group flex items-center justify-center w-11 h-11 rounded-2xl cursor-pointer bg-linear-to-br from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 shadow-lg shadow-red-900/40 transition-all duration-300"
          >
            <MessageSquarePlus size={20} className="text-white" />
          </button>

          {/* Settings */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-gray-500/20 hover:border-gray-500/30 transition-all duration-300"
            >
              <Settings
                size={19}
                className="text-zinc-300 cursor-pointer group-hover:text-gray-300 transition"
              />
            </button>

            {/* Dropdown */}
            {openDropdown && (
              <div className="absolute right-0 top-14 w-52 rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl overflow-hidden z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-white font-medium truncate">
                    {authUser?.fullName}
                  </p>

                  <p className="text-xs text-zinc-400 truncate">
                    {authUser?.email}
                  </p>
                </div>

                {/* Profile */}
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setOpenDropdown(false);
                  }}
                  className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition"
                >
                  <User size={18} />
                  My Profile
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="w-full flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;