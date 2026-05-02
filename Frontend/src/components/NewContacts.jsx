import React from "react";
import { useChat } from "../context/ChatContext";
import Avatar from "../assets/Avatar.png";
import UserLoading from "./Chat/UserLoading";
import NoChatContainer from "./Chat/NoChatContainer";

function NewContacts() {
  const { newContacts, isUserLoading, selectUser } = useChat();

  if (isUserLoading) return <UserLoading />;

  if (!newContacts.length) return <NoChatContainer />;

  return (
    <div className="space-y-3">
      {newContacts.map((user) => (
        <div
          key={user._id}
          className="px-4 py-2 rounded-lg cursor-pointer hover:bg-green-500/20 transition-colors"
          onClick={() => selectUser(user)}
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-12 rounded-full overflow-hidden">
              <img
                src={user.profileimg || Avatar}
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex justify-between w-full items-center">
              <p className="text-white font-medium">{user.name}</p>

              <span className="text-xs text-green-400 ">
                New
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NewContacts;
