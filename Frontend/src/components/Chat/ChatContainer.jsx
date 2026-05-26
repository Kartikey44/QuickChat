import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import ChatSender from "./ChatSender";
import ChatHeader from "./ChatHeader";
import TypingBubble from "./TypingBubble";
import MediaOverlay from "./MediaOverlay";

function ChatContainer() {
  const { selectedUser, getMessages, messages, isTyping } = useChat();
  const { authUser } = useAuth();
  const messagesEndRef = useRef(null);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser]);

  return (
    <div className="relative flex flex-col h-full w-full bg-[#2a0f0f]">
      {showMedia && (
        <MediaOverlay messages={messages} onClose={() => setShowMedia(false)} />
      )}

      <div className="border-b border-zinc-800">
        <ChatHeader onOpenMedia={() => setShowMedia(true)} />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 space-y-4 bg-gradient-to-br from-[#271111] via-[#2a0f15] to-[#170206]">
        {Array.isArray(messages) &&
          messages.map((msg) => {
            const senderId = msg.senderId?._id || msg.senderId;

            const authId = authUser?._id;

            const isSender = senderId?.toString() === authId?.toString();

            return (
              <div
                key={msg._id}
                className={`w-full flex ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${
                    isSender
                      ? "bg-cyan-700 rounded-br-sm"
                      : "bg-zinc-800 rounded-bl-sm"
                  }`}
                >
                  {/* TEXT */}
                  {msg.content && (
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-white break-words">
                        {msg.content}
                      </p>

                      <span className="text-[10px] text-zinc-300 self-end">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  {/* IMAGE */}
                  {msg.image && (
                    <div className="relative mt-2">
                      <img
                        src={msg.image}
                        alt="media"
                        className="rounded-xl max-w-[250px] object-cover"
                      />

                      <span className="absolute bottom-2 right-2 text-[10px] bg-black/50 px-2 py-1 rounded text-white">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        {isTyping && <TypingBubble isSender={false} />}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-zinc-800 bg-[#2a0f0f] px-3 py-3">
        <ChatSender />
      </div>
    </div>
  );
}

export default ChatContainer;
