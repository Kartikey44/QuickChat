import React, { useEffect, useRef, useState } from "react";

import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

import ChatSender from "./ChatSender";
import ChatHeader from "./ChatHeader";
import TypingBubble from "./TypingBubble";
import MediaOverlay from "./MediaOverlay";

import Avatar from "../../assets/Avatar.png";

function ChatContainer() {
  const {
    selectedUser,
    getMessages,
    messages,
    isTyping,
    editMessage,
    deleteMessage,
  } = useChat();

  const { authUser } = useAuth();

  const messagesEndRef = useRef(null);

  const [replyMessage, setReplyMessage] = useState(null);
  const [showMedia, setShowMedia] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!selectedUser?._id) return;
    if (selectedUser?.isAI) return;

    getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    const closeMenu = () => {
      setSelectedMessage(null);
    };

    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleMessageMenu = (e, msg) => {
    e.preventDefault();

    setSelectedMessage(msg);

    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-[#2a0f0f] overflow-hidden">
      {/* HEADER */}
      <div className="relative z-20 border-b border-zinc-800">
        <ChatHeader onOpenMedia={() => setShowMedia(true)} />
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto no-scrollbar z-0 space-y-5 bg-gradient-to-br from-[#271111] via-[#2a0f15] to-[#170206] px-4 py-5">
        {Array.isArray(messages) &&
          messages.map((msg) => {
            const senderId = msg.senderId?._id || msg.senderId;
            const authId = authUser?._id;

            const isSender = senderId?.toString() === authId?.toString();

            return (
              <div
                key={msg._id}
                onContextMenu={(e) => handleMessageMenu(e, msg)}
                className={`flex w-full items-end gap-2 ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                {!isSender && (
                  <img
                    src={selectedUser?.profileimg || Avatar}
                    alt="receiver"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}

                <div
                  className={`relative max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                    isSender
                      ? "rounded-br-sm bg-cyan-700"
                      : "rounded-bl-sm bg-zinc-800"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="shared"
                      className="max-w-[250px] rounded-xl mb-2 object-cover"
                    />
                  )}

                  {msg.video && (
                    <video
                      src={msg.video}
                      controls
                      className="max-w-[250px] rounded-xl mb-2"
                    />
                  )}

                  {msg.document && (
                    <a
                      href={msg.document}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-cyan-300 underline mb-2"
                    >
                      📄 Open Document
                    </a>
                  )}

                  {msg.content && (
                    <p className="break-words text-sm text-white mb-1">
                      {msg.content}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <span className="text-[10px] text-zinc-300">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {isSender && (
                  <img
                    src={authUser?.profileimg || Avatar}
                    alt="sender"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
              </div>
            );
          })}

        {isTyping && <TypingBubble isSender={false} />}

        <div ref={messagesEndRef} />
      </div>

      {/* SENDER */}
      <div className="relative z-20 border-t border-zinc-800 bg-[#2a0f0f] px-1 py-2">
        <ChatSender
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
        />
      </div>

      {/* OVERLAYS */}
      <div className="absolute inset-0 z-[9999] pointer-events-none">
        {showMedia && (
          <div className="pointer-events-auto">
            <MediaOverlay
              messages={messages}
              onClose={() => setShowMedia(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatContainer;
