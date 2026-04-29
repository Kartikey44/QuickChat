import React,{useState} from "react";
import { useChat } from "../context/ChatContext";
import Avatar from "../assets/Avatar.png";

function ChatHeader({ onOpenMedia }) {
  const { selectedUser } = useChat();

  return (
    <div
      onClick={onOpenMedia}
      className="flex items-center justify-between w-full px-5 py-3 border border-y-white/20 border-x-0 bg-[#161717] cursor-pointer"
    >
      {/* Left: Profile */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={selectedUser?.profileimg || Avatar}
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative h-3 w-3 rounded-full bg-green-500"></span>
          </span>
        </div>

        <div>
          <p className="font-medium">{selectedUser?.name || "User"}</p>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </div>

      {/* Right: Info */}
      <div className="text-sm text-gray-400">Media</div>
    </div>
  );
}

export default ChatHeader;
