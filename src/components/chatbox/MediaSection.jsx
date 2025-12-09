"use client"

import { useContext, useState } from "react"
import { ChatContext } from "../../context/userContext"

function MediaSection({ userId, onClose }) {
  const { getChatMedia } = useContext(ChatContext)
  const [activeTab, setActiveTab] = useState("images")
  const [selectedMedia, setSelectedMedia] = useState(null)

  const allMedia = getChatMedia(userId)

  const images = allMedia.filter((m) => m.type === "image")
  const videos = allMedia.filter((m) => m.type === "video")
  const documents = allMedia.filter((m) => m.type === "document" || m.type === "audio")

  const tabs = [
    { id: "images", label: "Images", count: images.length },
    { id: "videos", label: "Videos", count: videos.length },
    { id: "docs", label: "Documents", count: documents.length },
  ]

  const getCurrentMedia = () => {
    switch (activeTab) {
      case "images":
        return images
      case "videos":
        return videos
      case "docs":
        return documents
      default:
        return []
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-zinc-700">
        <h3 className="text-white font-semibold text-sm sm:text-base">Shared Media</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-zinc-700 rounded-full transition-colors">
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === tab.id ? "text-pink-500 border-b-2 border-pink-500" : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-hide">
        {getCurrentMedia().length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500 text-sm text-center">No {activeTab} shared yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {getCurrentMedia().map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedMedia(item)}
                className="aspect-square bg-zinc-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              >
                {item.type === "image" && (
                  <img src={item.data || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                )}
                {item.type === "video" && (
                  <div className="w-full h-full relative">
                    <video src={item.data} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
                {(item.type === "document" || item.type === "audio") && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-zinc-400 text-xs mt-1 truncate w-full text-center">{item.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-zinc-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {selectedMedia.type === "image" && (
              <img
                src={selectedMedia.data || "/placeholder.svg"}
                alt={selectedMedia.name}
                className="max-w-full max-h-[85vh] rounded-lg"
              />
            )}
            {selectedMedia.type === "video" && (
              <video src={selectedMedia.data} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaSection
