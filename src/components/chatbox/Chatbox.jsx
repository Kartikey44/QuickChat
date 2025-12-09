"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { ChatContext } from "../../context/userContext"
import { fileToBase64, getFileType, formatFileSize } from "../../lib/mediaUtils"
import MediaSection from "./MediaSection"

function Chatbox({ className, showSidebar, setShowSidebar }) {
  const [message, setMessage] = useState("")
  const [showMediaSection, setShowMediaSection] = useState(false)
  const [mediaPreview, setMediaPreview] = useState(null)
  const { selectedUser, messages, addMessage, updateContactLastMessage, profile } = useContext(ChatContext)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedUser])

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const fileType = getFileType(file)
    const base64 = await fileToBase64(file)

    setMediaPreview({
      type: fileType,
      data: base64,
      name: file.name,
      size: formatFileSize(file.size),
    })
  }

  const clearMediaPreview = () => {
    setMediaPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSend = (e) => {
    e.preventDefault()
    if ((!message.trim() && !mediaPreview) || !selectedUser) return

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      media: mediaPreview || null,
    }

    addMessage(selectedUser.id, newMessage)
    updateContactLastMessage(selectedUser.id, mediaPreview ? `📎 ${mediaPreview.type}` : message)
    setMessage("")
    clearMediaPreview()

    // Simulate reply after delay
    setTimeout(() => {
      addMessage(selectedUser.id, {
        id: Date.now() + 1,
        text: "Thanks for your message! This is an auto-reply.",
        sender: "them",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })
    }, 1000)
  }

  const currentMessages = selectedUser ? messages[selectedUser.id] || [] : []

  const renderMediaPreview = () => {
    if (!mediaPreview) return null
    return (
      <div className="p-2 bg-zinc-800 border-t border-zinc-700">
        <div className="flex items-center gap-2 bg-zinc-700 rounded-lg p-2">
          {mediaPreview.type === "image" && (
            <img
              src={mediaPreview.data || "/placeholder.svg"}
              alt="Preview"
              className="w-16 h-16 object-cover rounded"
            />
          )}
          {mediaPreview.type === "video" && (
            <video src={mediaPreview.data} className="w-16 h-16 object-cover rounded" />
          )}
          {mediaPreview.type === "document" && (
            <div className="w-16 h-16 bg-zinc-600 rounded flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">{mediaPreview.name}</p>
            <p className="text-zinc-400 text-xs">{mediaPreview.size}</p>
          </div>
          <button onClick={clearMediaPreview} className="p-1 hover:bg-zinc-600 rounded-full">
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  const renderMessageMedia = (msg) => {
    if (!msg.media) return null
    const { type, data, name } = msg.media

    if (type === "image") {
      return <img src={data || "/placeholder.svg"} alt={name} className="max-w-full rounded-lg mt-2 cursor-pointer" />
    }
    if (type === "video") {
      return <video src={data} controls className="max-w-full rounded-lg mt-2" />
    }
    if (type === "audio") {
      return <audio src={data} controls className="w-full mt-2" />
    }
    return (
      <div className="flex items-center gap-2 mt-2 bg-zinc-600/50 rounded-lg p-2">
        <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-sm truncate">{name}</span>
      </div>
    )
  }

  return (
    <div className={`${className} bg-zinc-800 flex flex-col`}>
      {selectedUser ? (
        <>
          {/* Chat header */}
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-zinc-700 bg-zinc-900 flex-shrink-0">
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-1.5 sm:p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <img
              src={selectedUser.avatar || "/placeholder.svg"}
              alt={selectedUser.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm sm:text-base truncate">{selectedUser.name}</h3>
              <p className="text-green-400 text-xs sm:text-sm">{selectedUser.online ? "Online" : "Offline"}</p>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setShowMediaSection(!showMediaSection)}
                className={`p-1.5 sm:p-2 hover:bg-zinc-800 rounded-full transition-colors ${showMediaSection ? "bg-pink-600" : ""}`}
                title="View shared media"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>
              <button className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {showMediaSection ? (
            <MediaSection userId={selectedUser.id} onClose={() => setShowMediaSection(false)} />
          ) : (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-hide min-h-0">
                {currentMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-zinc-500 text-sm sm:text-base text-center px-4">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-2 rounded-2xl ${
                          msg.sender === "me"
                            ? "bg-pink-600 text-white rounded-br-sm"
                            : "bg-zinc-700 text-white rounded-bl-sm"
                        }`}
                      >
                        {renderMessageMedia(msg)}
                        {msg.text && <p className="text-sm sm:text-base break-words">{msg.text}</p>}
                        <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-pink-200" : "text-zinc-400"}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Media preview */}
              {renderMediaPreview()}

              {/* Message input */}
              <form onSubmit={handleSend} className="p-2 sm:p-4 border-t border-zinc-700 bg-zinc-900 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-full transition-colors flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-zinc-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-500 min-w-0"
                  />
                  <button
                    type="submit"
                    className="p-2 sm:p-3 bg-pink-600 hover:bg-pink-700 rounded-full transition-colors flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      ) : (
        // No user selected state
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-8">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-zinc-700 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 sm:w-12 sm:h-12 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">Welcome to QuickChat</h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xs">
            Select a conversation from the sidebar to start chatting
          </p>
        </div>
      )}
    </div>
  )
}

export default Chatbox
