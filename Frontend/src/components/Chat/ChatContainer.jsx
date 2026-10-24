import React, { useEffect, useRef, useState } from "react";

import NoChatStartContainer from "./NoChatStartContainer";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

import ChatSender from "./ChatSender";
import ChatHeader from "./ChatHeader";
import TypingBubble from "./TypingBubble";
import MediaOverlay from "./MediaOverlay";

import Avatar from "../../assets/Avatar.png";

function ChatContainer() {
  const { selectedUser, messages, isTyping } = useChat();

  const { authUser } = useAuth();

  const messagesEndRef = useRef(null);

  const [replyMessage, setReplyMessage] = useState(null);
  const [showMedia, setShowMedia] = useState(false);

  // Automatically scroll to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  if (!selectedUser) {
    return <NoChatStartContainer />;
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#2a0f0f]">
      {/* HEADER */}

      <div className="relative z-20 shrink-0 border-b border-zinc-800">
        <ChatHeader onOpenMedia={() => setShowMedia(true)} />
      </div>

      {/* CHAT BODY */}

      <div
        className="
          smooth-scroll
          no-scrollbar
          z-0
          flex-1
          space-y-5
          overflow-y-auto
          bg-gradient-to-br
          from-[#271111]
          via-[#2a0f15]
          to-[#170206]
          px-3
          py-5
          sm:px-4
        "
      >
        {Array.isArray(messages) &&
          messages.map((msg) => {
            const senderId = msg.senderId?._id || msg.senderId;

            const authId = authUser?._id;

            const isSender = senderId?.toString() === authId?.toString();

            // Only assistant responses in AI chat use Markdown.
            const isAIResponse = Boolean(selectedUser?.isAI && !isSender);

            // Allow longer AI messages to use more screen space.
            const bubbleWidth = isAIResponse
              ? "max-w-[95%] sm:max-w-[90%] lg:max-w-[85%]"
              : "max-w-[80%] sm:max-w-[75%]";

            return (
              <div
                key={msg._id}
                className={`flex w-full min-w-0 items-end gap-2 ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                {/* RECEIVER / AI AVATAR */}

                {!isSender && (
                  <img
                    src={selectedUser?.profileimg || Avatar}
                    alt={`${selectedUser?.name || "Receiver"} avatar`}
                    className="
                      h-8 w-8 shrink-0
                      rounded-full object-cover
                    "
                  />
                )}

                {/* MESSAGE BUBBLE */}

                <div
                  className={`relative min-w-0 ${bubbleWidth} rounded-2xl px-3 py-3 shadow-md sm:px-4 ${
                    isSender
                      ? "rounded-br-sm bg-cyan-700 text-white"
                      : "rounded-bl-sm bg-zinc-800 text-zinc-100"
                  }`}
                >
                  {/* IMAGE ATTACHMENT */}

                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared attachment"
                      loading="lazy"
                      className="
                        mb-2 max-h-80 max-w-full
                        rounded-xl object-contain
                      "
                    />
                  )}

                  {/* VIDEO ATTACHMENT */}

                  {msg.video && (
                    <video
                      src={msg.video}
                      controls
                      preload="metadata"
                      className="
                        mb-2 max-h-80 max-w-full
                        rounded-xl
                      "
                    />
                  )}

                  {/* DOCUMENT ATTACHMENT */}

                  {msg.document && (
                    <a
                      href={msg.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        mb-2 block break-words
                        text-cyan-300 underline
                      "
                    >
                      📄 Open Document
                    </a>
                  )}

                  {/* MESSAGE CONTENT */}

                  {msg.content &&
                    (isAIResponse ? (
                      <div className="chat-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p
                        className="
                          m-0 whitespace-pre-wrap
                          break-words text-sm leading-6
                        "
                      >
                        {msg.content}
                      </p>
                    ))}

                  {/* MESSAGE TIMESTAMP */}

                  <div className="mt-2 flex justify-end">
                    <span className="text-[10px] text-zinc-300">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                </div>

                {/* SENDER AVATAR */}

                {isSender && (
                  <img
                    src={authUser?.profileimg || Avatar}
                    alt="Your avatar"
                    className="
                      h-8 w-8 shrink-0
                      rounded-full object-cover
                    "
                  />
                )}
              </div>
            );
          })}

        {/* TYPING INDICATOR */}

        {isTyping && <TypingBubble isSender={false} />}

        {/* SCROLL TARGET */}

        <div ref={messagesEndRef} />
      </div>

      {/* MESSAGE INPUT */}

      <div
        className="
          relative z-20 shrink-0
          border-t border-zinc-800
          bg-[#2a0f0f] px-1 py-2
        "
      >
        <ChatSender
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
        />
      </div>

      {/* MEDIA OVERLAY */}

      {showMedia && (
        <div className="absolute inset-0 z-[9999]">
          <MediaOverlay
            messages={messages}
            onClose={() => setShowMedia(false)}
          />
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
