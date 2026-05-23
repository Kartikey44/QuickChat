import React, { useState, useEffect,useMemo } from "react";
import ContactSearchBar from "./ContactSearchBar";
import Avatar from '../../assets/Avatar.png'
import { useChat } from "../../context/ChatContext";
function ContactOverlay() {
  const { chats, selectUser } = useChat();
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
    <div className="absolute inset-0 bg-linear-to-br from-[#3d0202] to-[#1b0000] flex items-center justify-center z-50">
      <div className="p-6 w-full h-full flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <p className="text-3xl font-bold bg-gradient-to-r from-[#0f7ee8] via-[#8c288d] to-[#d20a70] bg-clip-text text-transparent ">
            QuickChat
          </p>
          <h2 className="font-semibold text-xl px-2">All Contacts</h2>
          <ContactSearchBar onSearch={setQ} />
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
            {filtered.length === 0 ? (
              <p className="text-gray-400 text-center">No users found</p>
            ) : (
              filtered.map((user) => (
                <div
                  key={user._id}
                  onClick={() => selectUser(user)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-[#5e0404] transition"
                >
                  <img
                    src={user.profileimg || Avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white">{user.name}</p>
                    {user.email && (
                      <p className="text-xs text-gray-400">{user.email}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactOverlay;
