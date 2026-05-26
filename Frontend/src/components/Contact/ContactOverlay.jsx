import React, { useState, useMemo } from "react";

import ContactSearchBar from "./ContactSearchBar";

import Avatar from "../../assets/Avatar.png";

import { useChat } from "../../context/ChatContext";
import { IoClose } from "react-icons/io5";

function ContactOverlay({ onClose }) {
  const { chats, selectUser, onlineUsers } = useChat();

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();

    return chats
      .filter((u) => {
        if (!term) return true;

        const name = u.name?.toLowerCase() || "";

        const email = u.email?.toLowerCase() || "";

        return name.includes(term) || email.includes(term);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [q, chats]);

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-2xl h-screen bg-linear-to-br from-[#2a030a] via-[#400505] to-[#290000] border border-zinc-800 overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-2 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold text-white">All Contacts</h1>

            <p className="text-sm text-zinc-400 mt-1">
              Start a new conversation
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 transition"
          >
            <IoClose size={24} className="text-zinc-300" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-4 border-b border-zinc-800">
          <ContactSearchBar onSearch={setQ} />
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
              <p className="text-lg">No users found</p>

              <span className="text-sm mt-1">Try another keyword</span>
            </div>
          ) : (
            filtered.map((user) => {
              const isOnline = onlineUsers?.includes(user._id);

              return (
                <button
                  key={user._id}
                  onClick={() => {
                    selectUser(user);

                    if (onClose) onClose();
                  }}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-800 transition-all duration-200 text-left"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={user.profileimg || Avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#111827] rounded-full" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-white font-medium truncate">
                      {user.name}
                    </p>

                    <p className="text-sm text-zinc-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactOverlay;
