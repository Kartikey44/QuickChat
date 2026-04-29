import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import Avatar from '../assets/Avatar.png'
import UserLoading from "./UserLoading";
import NoChatContainer from "./NoChatContainer";

function AllChats() {
  const { getMyChatPartners, chats, isUserLoading, selectUser } =
    useChat();
  const { authUser } = useAuth();

  useEffect(() => {
    getMyChatPartners();
  }, []);

  if (isUserLoading) {
    return <UserLoading />;
  }

  if (chats.length === 0) {
    return <NoChatContainer />;
  }

  return (
    <div className="space-y-3">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-transparent px-4 py-2 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => selectUser(chat)}
        >
          <div className="flex items-center gap-5">
            <div className="size-12 rounded-full overflow-hidden">
              <img
                src={chat.profileimg|| Avatar}
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
