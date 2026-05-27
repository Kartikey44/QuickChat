import React from "react";

import { useNavigate } from "react-router-dom";

import { useChat } from "../context/ChatContext";

import Avatar from "../assets/Avatar.png";

import UserLoading from "./Chat/UserLoading";

import NoChatAvailableContainer from "./Chat/NoChatStartContainer";

export default function ChatPartners({ searchQuery = "" }) {
  const navigate = useNavigate();

  const {
    chatPartners,
    isUserLoading,
    selectUser,
    selectedUser,
    unreadCounts,
  } = useChat();

  if (isUserLoading) return <UserLoading />;

  if (!chatPartners.length) {
    return <NoChatAvailableContainer />;
  }

  const filteredChats = chatPartners.filter((chat) =>
    (chat.fullName || chat.name || "")
      .toLowerCase()
      .includes((searchQuery || "").toLowerCase()),
  );

  const handleSelectUser = (chat) => {
    selectUser(chat);

    navigate(`/chat/${chat._id}`);
  };

  return (
    <div className="space-y-3">
      {filteredChats.map((chat) => {
        const unreadCount = unreadCounts?.[chat._id] || 0;

        return (
          <div
            key={chat._id}
            onClick={() => handleSelectUser(chat)}
            className={`px-2 py-2 rounded-xl cursor-pointer transition-all ${
              selectedUser?._id === chat._id
                ? "bg-[#f10505]"
                : "hover:bg-[#540101]"
            }`}
          >
            <div className="w-full flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={chat.profileimg || Avatar}
                  className="w-12 h-12 object-cover rounded-full"
                />

                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center bg-red-600 text-white text-[10px] rounded-full font-bold">
                    {unreadCount}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between w-full min-w-0">
                <p className="text-white truncate">{chat.name || chat.email}</p>

                {unreadCount > 0 && (
                  <span className="text-xs text-red-300 font-medium shrink-0">
                    New
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {filteredChats.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No chats found</p>
      )}
    </div>
  );
}
