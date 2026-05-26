import React from "react";

import { useNavigate } from "react-router-dom";

import { useChat } from "../../context/ChatContext";

import Avatar from "../../assets/Avatar.png";

function UnreadChats({ searchQuery = "" }) {
  const navigate = useNavigate();

  const { chatPartners, unreadCounts, selectUser, selectedUser } = useChat();

  const unreadUsers = chatPartners.filter(
    (user) => unreadCounts?.[user._id] > 0,
  );

  const filteredUnread = unreadUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectUser = (user) => {
    selectUser(user);

    navigate(`/chat/${user._id}`);
  };

  return (
    <div className="flex flex-col gap-2">
      {filteredUnread.map((user) => {
        const unreadCount = unreadCounts?.[user._id] || 0;

        return (
          <div
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              selectedUser?._id === user._id
                ? "bg-[#ba0d0d]"
                : "hover:bg-[#2a2a2a]"
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={user.profileimg || Avatar}
                alt="avatar"
                className="w-11 h-11 rounded-full object-cover"
              />

              <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center bg-red-600 text-white text-[10px] rounded-full font-bold">
                {unreadCount}
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-gray-200 font-medium truncate">
                {user.name}
              </span>

              <span className="text-xs text-gray-400 truncate">
                New messages
              </span>
            </div>
          </div>
        );
      })}

      {filteredUnread.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No unread chats</p>
      )}
    </div>
  );
}
export default UnreadChats;
