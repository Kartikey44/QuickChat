import React from "react";
import { LuMessageCircleMore } from "react-icons/lu";
import { useChat } from "../../context/ChatContext";
import Avatar from "../../assets/Avatar.png";

function NoChatStartContainer() {
  const { newContacts, selectUser } = useChat();

  const users = newContacts.slice(0, 6);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-6 w-full max-w-xl h-full p-4">
        <div className="bg-cyan-900/10 h-60 rounded-[30px] flex flex-col items-center justify-center gap-4">
          <LuMessageCircleMore size={60} className="text-cyan-600" />
          <p className="text-cyan-400 font-semibold text-lg">
            No conversations yet
          </p>
          <p className="text-gray-400 text-sm">
            Start chatting with someone 👇
          </p>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto smooth-scroll no-scrollbar">
          <p className="text-white/70 text-sm px-1">Suggested Users</p>

          {users.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">
              No users available
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center cursor-pointer justify-between bg-[#1f1f1f] px-4 py-2 rounded-lg hover:bg-cyan-500/10 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileimg || Avatar}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={user.name}
                  />
                  <p className="text-white">{user.name}</p>
                </div>

                <button
                  onClick={() => selectUser(user)}
                  className="text-sm px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-md"
                >
                  Chat
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NoChatStartContainer;