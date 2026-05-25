import React from "react";
import { Phone, Video, ImageIcon, MoreVertical } from "lucide-react";

import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../assets/Avatar.png";

function ChatHeader({ onOpenMedia }) {
  const { selectedUser, isTyping } = useChat();

  const { onlineUsers } = useAuth();

  const isOnline = onlineUsers.includes(selectedUser?._id);

  return (
    <div className="relative w-full overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#140107]/95 via-[#1b0006]/95 to-[#120003]/95 backdrop-blur-2xl">
      {/* Glow Effects */}
      <div className="absolute top-[-80px] left-[20%] w-[180px] h-[180px] bg-red-700/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[10%] w-[200px] h-[200px] bg-pink-700/10 blur-3xl rounded-full"></div>

      {/* Main Header */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center gap-4">
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

            {/* Status */}
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
          <button className="group hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300">
            <Phone
              size={18}
              className="text-zinc-300 group-hover:text-red-300 transition"
            />
          </button>

          {/* Video Call */}
          <button className="group hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300">
            <Video
              size={18}
              className="text-zinc-300 group-hover:text-red-300 transition"
            />
          </button>

          {/* Media */}
          <button
            onClick={onOpenMedia}
            className="group flex items-center justify-center gap-2 px-4 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300"
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
          <button className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300">
            <MoreVertical
              size={18}
              className="text-zinc-300 group-hover:text-red-300 transition"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
