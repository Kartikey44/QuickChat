import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import ChatSender from "./ChatSender";
import ChatHeader from "./ChatHeader";

function ChatContainer() {
  const { selectedUser, getMessages, messages } = useChat();
  const { authUser } = useAuth();

  const messagesEndRef = useRef(null);

  const [showMedia, setShowMedia] = useState(false);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* HEADER */}
      <div className="h-17">
        <ChatHeader onOpenMedia={() => setShowMedia(true)} />
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 bg-[#1b1c1c] py-2 space-y-3 flex flex-col justify-end">
        {Array.isArray(messages) &&
          messages.map((msg) => {
            return (
              <div
                key={msg._id}
                className={`flex ${
                  msg.senderId === authUser._id
                    ? "justify-end "
                    : "justify-start "
                }`}
              >
                <div className="max-w-xs rounded-lg px-3 py-2 text-white">
                  {/* TEXT */}
                  {msg.content && (
                    <div className="flex gap-1">
                      <p className="wrap-break-words">{msg.content}</p>
                      <p className="text-[10px] text-gray-300 text-right mt-2 flex items-end">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}

                  {/* IMAGE */}
                  {msg.image && (
                    <div className="relative mt-1">
                      <img
                        src={msg.image}
                        alt="media"
                        className="rounded-lg max-w-40 object-cover" 
                      />

                      <p className="absolute bottom-1 right-2 text-[10px] text-white bg-black/40 px-1 rounded">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* SENDER */}
      <div className="h-20">
        <div className="bg-[#1b1c1c] px-3 py-3 shadow-2xl h-full flex items-center">
          <ChatSender />
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
