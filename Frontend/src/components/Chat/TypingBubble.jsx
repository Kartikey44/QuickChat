import React from "react";
import Avatar from "../../assets/Avatar.png";
import { useAuth } from "../../context/AuthContext";

function TypingBubble({ isSender = false }) {
  const { authUser } = useAuth();
  return (
    <div
      className={`flex ${isSender ? "justify-end" : "justify-start"} px-2 animate-fadeIn`}
    >
      <div
        className={`flex items-end gap-2 ${isSender ? "flex-row-reverse" : ""}`}
      >
        {!isSender && (
          <img
            src={authUser.profileimg||Avatar}
            alt="user"
            className="w-7 h-7 rounded-full object-cover"
          />
        )}

        <div
          className={`relative px-3 py-2 rounded-2xl ${
            isSender
              ? "bg-green-600 text-white rounded-br-none"
              : "bg-gray-700 text-white rounded-bl-none"
          }`}
        >
          <div
            className={`absolute bottom-0 w-3 h-3 rotate-45 ${
              isSender ? "-right-1.5 bg-green-600" : "-left-1.5 bg-gray-700"
            }`}
          />

          <div className="flex gap-1 items-center">
            <span className="w-2 h-2 bg-white/80 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
            <span className="w-2 h-2 bg-white/80 rounded-full animate-[bounce_1s_infinite_150ms]"></span>
            <span className="w-2 h-2 bg-white/80 rounded-full animate-[bounce_1s_infinite_300ms]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingBubble;
