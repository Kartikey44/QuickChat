import React from "react";
import { LuMessageCircleMore } from "react-icons/lu";
import { useChat } from "../../context/ChatContext";
import Avatar from "../../assets/Avatar.png";

function NoChatContainer() {
  const { newContacts, selectUser } = useChat();

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-lg">
        {/* Empty State */}
        <div className="bg-cyan-900/10 w-full h-64 rounded-[40px] flex flex-col items-center justify-center gap-4 text-center">
          <LuMessageCircleMore size={70} className="text-cyan-600" />
          <p className="text-cyan-400 font-semibold text-xl">
            No conversations yet
          </p>
          <p className="text-gray-400 text-sm">
            Start chatting with someone below 👇
          </p>
        </div>

        {/* Suggested Users */}
        {newContacts.length > 0 && (
          <div className="w-full flex flex-col gap-3">
            <p className="text-white/70 text-sm">Suggested Users</p>

            {newContacts.slice(0, 4).map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-[#1f1f1f] px-4 py-2 rounded-lg hover:bg-cyan-500/10 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileimg || Avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoChatContainer;
