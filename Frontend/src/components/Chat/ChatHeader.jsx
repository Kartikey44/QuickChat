import React, { useState, useRef, useEffect } from "react";
import { Phone, Video, ImageIcon, MoreVertical, ArrowLeft } from "lucide-react";
import { createPortal } from "react-dom";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../assets/Avatar.png";

function ChatHeader({ onOpenMedia }) {
  const {
    selectedUser,
    isTyping,
    isAITyping,
    setSelectedUser,
    clearChat,
    deleteChat,
  } = useChat();

  const [openMore, setOpenMore] = useState(false);

  const [showActionModal, setShowActionModal] = useState(false);

  const [actionType, setActionType] = useState(null);

  const { onlineUsers } = useAuth();

  const menuRef = useRef(null);

  const isOnline = selectedUser?.isAI
    ? true
    : onlineUsers.includes(selectedUser?._id);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMore(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!selectedUser) return null;

  return (
    <div className="relative w-full border-b border-white/10 bg-linear-to-r from-[#140107]/95 via-[#1b0006]/95 to-[#120003]/95 backdrop-blur-2xl">
      {/* Glow Effects */}
      <div className="absolute -top-20 left-[20%] w-45 h-45 bg-red-700/10 blur-3xl rounded-full"></div>

      <div className="absolute -bottom-25 right-[10%] w-50 h-50 bg-pink-700/10 blur-3xl rounded-full"></div>

      {/* Main Header */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* Mobile Back Button */}
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
              alt={selectedUser?.name || "User"}
              onError={(e) => {
                e.target.src = Avatar;
              }}
              className="relative w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg"
            />

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
              {selectedUser?.name}
            </h2>

            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-zinc-500"
                }`}
              />

              <p className="text-sm text-zinc-400">
                {selectedUser?.isAI
                  ? isAITyping
                    ? "Thinking..."
                    : "Always Available"
                  : isOnline
                    ? "Online"
                    : "Offline"}
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

          {/* More Menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpenMore((prev) => !prev)}
              className="group flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300"
            >
              <MoreVertical
                size={18}
                className="text-zinc-300 group-hover:text-red-300 transition"
              />
            </button>

            {openMore && (
              <div className="absolute top-14 right-0 z-50 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#1a0008]/95 backdrop-blur-2xl shadow-2xl">
                <button
                  onClick={() => {
                    setActionType("clear");
                    setShowActionModal(true);
                    setOpenMore(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/5 transition"
                >
                  Clear Chat
                </button>
                <button
                  onClick={() => {
                    setActionType("delete");
                    setShowActionModal(true);
                    setOpenMore(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition"
                >
                  Delete Chat
                </button>
              </div>
            )}
            {showActionModal &&
              createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md">
                  <div className="w-[90%] max-w-md rounded-3xl border border-white/10 bg-[#140107] p-6 shadow-[0_0_50px_rgba(255,0,60,0.15)]">
                    <h3 className="text-xl font-semibold text-white">
                      {actionType === "delete" ? "Delete Chat" : "Clear Chat"}
                    </h3>

                    <p className="mt-3 text-sm text-zinc-400">
                      {actionType === "delete"
                        ? `Are you sure you want to remove ${
                            selectedUser?.name || "this chat"
                          } from your chat list?`
                        : "Are you sure you want to clear all messages from this chat window?"}
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => {
                          if (actionType === "delete") {
                            deleteChat();
                          } else {
                            clearChat();
                          }
                          setShowActionModal(false);
                        }}
                        className={`rounded-xl px-4 py-2 text-sm font-medium text-white ${
                          actionType === "delete"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-amber-600 hover:bg-amber-700"
                        }`}
                      >
                        {actionType === "delete" ? "Delete" : "Clear"}
                      </button>
                    </div>
                  </div>
                </div>,
                document.body,
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
