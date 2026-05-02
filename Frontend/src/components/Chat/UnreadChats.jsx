import React from "react";
import { useChat } from "../../context/ChatContext";
import Avatar from "../../assets/Avatar.png";

function UnreadChats({ searchQuery }) {
  const { unreadUsers, setSelectedUser } = useChat();

  const filteredUnread = unreadUsers?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2">
      {filteredUnread?.map((user) => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-[#2a2a2a]"
        >
          <img
            src={user.profilePic || Avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="flex flex-col flex-1">
            <span className="text-gray-200 font-medium">{user.name}</span>
            <span className="text-xs text-gray-400">{user.lastMessage}</span>
          </div>

          <span className="bg-fuchsia-600 text-white text-xs px-2 py-0.5 rounded-full">
            {user.unreadCount}
          </span>
        </div>
      ))}

      {filteredUnread?.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No unread chats</p>
      )}
    </div>
  );
}

export default UnreadChats;