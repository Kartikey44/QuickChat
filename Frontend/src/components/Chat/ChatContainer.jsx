import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import ChatSender from "../Chat/ChatSender";
import ChatHeader from "../Chat/ChatHeader";
import TypingBubble from "../Chat/TypingBubble";

function ChatContainer() {
  const { selectedUser, getMessages, messages, isTyping } = useChat();
  const { authUser } = useAuth();

  const messagesEndRef = useRef(null);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-17">
        <ChatHeader onOpenMedia={() => setShowMedia(true)} />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 bg-linear-to-br from-[#2e0c14] via-[#1a010b] to-[#170000] py-2 space-y-3">
        {Array.isArray(messages) &&
          messages.map((msg) => {
            const isSender =
              msg.senderId?.toString() === authUser._id?.toString();

            return (
              <div
                key={msg._id}
                className={`flex ${isSender ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`relative max-w-xs px-3 py-2 text-white rounded-2xl ${
                    isSender
                      ? "bg-[#04354e] rounded-bl-none"
                      : "bg-[#ce0707] rounded-br-none"
                  }`}
                >

                  {msg.content && (
                    <div className="flex gap-2 items-end">
                      <p className="wrap-break-words">{msg.content}</p>
                      <p className="text-[10px] text-gray-300">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}

                  {msg.image && (
                    <div className="relative mt-1">
                      <img
                        src={msg.image}
                        alt="media"
                        className="rounded-lg max-w-40 object-cover"
                      />
                      <p className="absolute bottom-1 right-2 text-[10px] text-white  px-1 rounded">
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

        {isTyping && <TypingBubble isSender={false} />}

        <div ref={messagesEndRef} />
      </div>

      <div className="h-20">
        <div className="px-3 bg-lineart-to-br from-[#0f0000] to-[#3a0105] py-3 shadow-2xl h-full flex items-center">
          <ChatSender />
        </div>
      </div>
    </div>
  );
}

export default ChatContainer; 