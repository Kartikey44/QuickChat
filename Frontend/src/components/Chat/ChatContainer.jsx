import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import ChatSender from "./ChatSender";
import ChatHeader from "./ChatHeader";
import TypingBubble from "./TypingBubble";
import MediaOverlay from "./MediaOverlay";

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
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
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
    <div className="relative flex h-full w-full flex-col bg-[#2a0f0f]">
      {/* MEDIA OVERLAY */}
      {showMedia && (
        <MediaOverlay messages={messages} onClose={() => setShowMedia(false)} />
      )}

      {/* HEADER */}
      <div className="border-b border-zinc-800">
        <ChatHeader onOpenMedia={() => setShowMedia(true)} />
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 bg-linear-to-br from-[#271111] via-[#2a0f15] to-[#170206] px-4 py-5">
        {Array.isArray(messages) &&
          messages.map((msg) => {
            const senderId = msg.senderId?._id || msg.senderId;

            const authId = authUser?._id;

            const isSender = senderId?.toString() === authId?.toString();

            return (
              <div
                key={msg._id}
                onContextMenu={(e) => handleMessageMenu(e, msg)}
                className={`flex w-full ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative max-w-[75%] rounded-2xl px-4 py-3 shadow-md transition-all hover:ring-1 hover:ring-white/10 ${
                    isSender
                      ? "rounded-br-sm bg-cyan-700"
                      : "rounded-bl-sm bg-zinc-800"
                  }`}
                >
                  {/* REPLY REFERENCE */}
                  {msg.replyTo && (
                    <div className="mb-2 rounded-xl border-l-2 border-cyan-400 bg-black/20 px-3 py-2">
                      <p className="text-[11px] font-medium text-cyan-300">
                        {msg.replyTo.senderName}
                      </p>

                      <p className="truncate text-xs text-zinc-300">
                        {msg.replyTo.content || "Image"}
                      </p>
                    </div>
                  )}

                  {/* TEXT MESSAGE */}
                  {msg.content && (
                    <div className="flex flex-col gap-1">
                      <p className="wrap-break-words text-sm text-white">
                        {msg.content}
                      </p>

                      <div className="flex items-center justify-end gap-2">
                        {msg.edited && (
                          <span className="text-[10px] italic text-zinc-300">
                            edited
                          </span>
                        )}

                        <span className="text-[10px] text-zinc-300">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* IMAGE */}
                  {msg.image && (
                    <div className="relative mt-2">
                      <img
                        src={msg.image}
                        alt="media"
                        className="max-w-63 rounded-xl object-cover"
                      />

                      <span className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-[10px] text-white">
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

        {/* TYPING */}
        {isTyping && <TypingBubble isSender={false} />}

        <div ref={messagesEndRef} />
      </div>

      {/* MENU */}
      {selectedMessage && (
        <div
          style={{
            top: menuPosition.y,
            left: menuPosition.x,
          }}
          className="fixed z-50 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#1a0008]/95 backdrop-blur-2xl"
        >
          {/* EDIT */}
          {(
            selectedMessage.senderId?._id || selectedMessage.senderId
          )?.toString() === authUser?._id?.toString() && (
            <button
              onClick={async () => {
                const newContent = prompt(
                  "Edit message",
                  selectedMessage.content,
                );

                if (!newContent?.trim()) return;

                await editMessage(selectedMessage._id, newContent);

                setSelectedMessage(null);
              }}
              className="w-full px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/5"
            >
              Edit Message
            </button>
          )}

          {/* DELETE */}
          <button
            onClick={() => {
              deleteMessage(selectedMessage._id);

              setSelectedMessage(null);
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
          >
            Delete Message
          </button>

          {/* COPY */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(selectedMessage.content || "");

              setSelectedMessage(null);
            }}
            className="w-full px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/5"
          >
            Copy Message
          </button>

          {/* REPLY */}
          <button
            onClick={() => {
              setReplyMessage(selectedMessage);

              setSelectedMessage(null);
            }}
            className="w-full px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/5"
          >
            Reply Message
          </button>
        </div>
      )}

      {/* REPLY OVERLAY */}
      {replyMessage && (
        <div className="bg-[#22070b] px-4 py-3">
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex flex-col gap-1 overflow-hidden">
              <span className="text-xs font-medium text-cyan-400">
                Replying to{" "}
                {(
                  replyMessage.senderId?._id || replyMessage.senderId
                )?.toString() === authUser?._id?.toString()
                  ? "yourself"
                  : selectedUser?.name}
              </span>

              <p className="max-w-65 truncate text-sm text-zinc-300">
                {replyMessage.content || "Image"}
              </p>
            </div>

            <button
              onClick={() => setReplyMessage(null)}
              className="text-zinc-400 transition hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* SENDER */}
      <div className="border-t border-zinc-800 bg-[#2a0f0f] px-1 py-2">
        <ChatSender
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
        />
      </div>
    </div>
  );
}

export default ChatContainer;