import React from "react";

import { useNavigate } from "react-router-dom";

import { useChat } from "../context/ChatContext";

import Avatar from "../assets/Avatar.png";

import UserLoading from "./Chat/UserLoading";

import NoChatContainer from "./Chat/NoChatContainer";

function AllChats() {
  const navigate = useNavigate();

  const { chatPartners, newContacts, isUserLoading, selectUser, unreadCounts } =
    useChat();

  const allChats = [...chatPartners, ...newContacts];

  if (isUserLoading) return <UserLoading />;

  if (!allChats.length) return <NoChatContainer />;

  const handleSelectUser = (chat) => {
    selectUser(chat);

    navigate(`/chat/${chat._id}`);
  };

  return (
    <div className="space-y-3">
      {allChats.map((chat) => {
        const unreadCount = unreadCounts?.[chat._id] || 0;

        return (
          <div
            key={chat._id}
            className="px-4 py-3 rounded-xl cursor-pointer hover:bg-[#570707] transition-colors"
            onClick={() => handleSelectUser(chat)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={chat.profileimg || Avatar}
                    alt={chat.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />

                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center bg-red-600 text-white text-[10px] rounded-full font-bold">
                      {unreadCount}
                    </div>
                  )}
                </div>

                <p className="text-white font-medium truncate">{chat.name}</p>
              </div>

              {unreadCount > 0 && (
                <span className="text-xs text-red-300 shrink-0">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AllChats;
