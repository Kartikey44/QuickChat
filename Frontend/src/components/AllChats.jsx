import React from "react";
import { useChat } from "../context/ChatContext";
import Avatar from "../assets/Avatar.png";
import UserLoading from "./Chat/UserLoading";
import NoChatContainer from "./Chat/NoChatContainer";

function AllChats() {
  const { chatPartners, newContacts, isUserLoading, selectUser } = useChat();

  const allChats = [...chatPartners, ...newContacts];

  if (isUserLoading) return <UserLoading />;

  if (!allChats.length) return <NoChatContainer />;

  return (
    <div className="space-y-3">
      {allChats.map((chat) => (
        <div
          key={chat._id}
          className="px-4 py-2 rounded-lg cursor-pointer hover:bg-[#570707] transition-colors"
          onClick={() => selectUser(chat)}
        >
          <div className="flex items-center gap-5">
            <div className="size-12 rounded-full overflow-hidden">
              <img
                src={chat.profileimg || Avatar}
                alt={chat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white font-medium">{chat.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllChats;