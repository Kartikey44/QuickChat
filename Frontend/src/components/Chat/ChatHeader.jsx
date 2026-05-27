import React, { useState, useRef, useEffect } from "react";
import { Phone, Video, ImageIcon, MoreVertical, ArrowLeft } from "lucide-react";

import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../assets/Avatar.png";

function ChatHeader({ onOpenMedia }) {
  const { selectedUser, isTyping, setSelectedUser,clearChat } = useChat();
  const [openMore, setOpenMore] = useState(false);
  const { onlineUsers } = useAuth();

  const isOnline = onlineUsers.includes(selectedUser?._id);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMore(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full  border-b border-white/10 bg-linear-to-r from-[#140107]/95 via-[#1b0006]/95 to-[#120003]/95 backdrop-blur-2xl">
      {/* Glow Effects */}
      <div className="absolute -top-20 left-[20%] w-45 h-45 bg-red-700/10 blur-3xl rounded-full"></div>

      <div className="absolute -bottom-25 right-[10%] w-50 h-500 bg-pink-700/10 blur-3xl rounded-full"></div>

      {/* Main Header */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* MOBILE BACK BUTTON */}
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 transition"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>

          {/* Avatar */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-lg"></div>

            <img
              src={selectedUser?.profileimg || Avatar}
              alt="user"
              className="relative w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg"
            />

            {/* Online Indicator */}
            {isOnline && (
              <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>

                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-[#140107]"></span>
              </span>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col">
            <h2 className="text-white font-semibold text-[16px] md:text-lg">
              {selectedUser?.name || "User"}
            </h2>

            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-zinc-500"
                }`}
              ></span>

              <p className="text-sm text-zinc-400">
                {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Voice Call */}
          <button className="group hidden cursor-pointer sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300">
            <Phone
              size={18}
              className="text-zinc-300 group-hover:text-red-300 transition"
            />
          </button>

          {/* Video Call */}
          <button className="group hidden sm:flex cursor-pointer items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300">
            <Video
              size={18}
              className="text-zinc-300 group-hover:text-red-300 transition"
            />
          </button>

          {/* Media */}
          <button
            onClick={onOpenMedia}
            className="group flex items-center cursor-pointer justify-center gap-2 px-4 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300"
          >
            <ImageIcon
              size={18}
              className="text-zinc-300 group-hover:text-red-300 transition"
            />

            <span className="hidden md:block text-sm text-zinc-300 group-hover:text-red-300 transition">
              Media
            </span>
          </button>

          {/* More */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpenMore((prev) => !prev)}
              className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 cursor-pointer hover:border-red-500/30 transition-all duration-300"
            >
              <MoreVertical
                size={18}
                className="text-zinc-300  group-hover:text-red-300 transition"
              />
            </button>

            {openMore && (
              <div className="absolute top-14 right-0 z-50 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#1a0008]/95 backdrop-blur-2xl shadow-2xl">
                <button
                  onClick={() => {
                    clearChat();
                    setOpenMore(false);
                  }}
                  className="w-full px-4 py-3 text-left cursor-pointer text-sm text-zinc-300 hover:bg-white/5"
                >
                  Clear Chat
                </button>

                <button className="w-full cursor-pointer px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10">
                  Delete Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
