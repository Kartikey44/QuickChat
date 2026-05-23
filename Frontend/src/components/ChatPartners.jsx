import React from "react";
import { useChat } from "../context/ChatContext";
import Avatar from "../assets/Avatar.png";
import UserLoading from "./Chat/UserLoading";
import NoChatAvailableContainer from "./Chat/NoChatStartContainer";

export default function ChatPartners({ searchQuery = "" }) {
  const { chatPartners, isUserLoading, selectUser, selectedUser } = useChat();

  if (isUserLoading) return <UserLoading />;
  if (!chatPartners.length) return <NoChatAvailableContainer />;
const filteredChats = chatPartners.filter((chat) => {
  return (chat.fullName || chat.name || "")
    .toLowerCase()
    .includes((searchQuery || "").toLowerCase());
});
  return (
    <div className="space-y-3">
      {filteredChats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => selectUser(chat)}
          className={`px-4 py-2 rounded-lg cursor-pointer ${
            selectedUser?._id === chat._id
              ? "bg-[#ba0d0d] hover:bg-[#650202]"
              : ""
          }`}
        >
          <div className="w-full flex items-center gap-3">
            <img
              src={chat.profileimg || Avatar}
              className="w-12 h-12 object-cover rounded-full"
            />
            <p className="text-white">{chat.name || chat.email}</p>
          </div>
        </div>
      ))}

      {filteredChats.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No chats found</p>
      )}
    </div>
  );
}