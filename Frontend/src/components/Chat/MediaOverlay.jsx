import React, { useMemo, useState } from "react";

import { IoClose } from "react-icons/io5";

function MediaOverlay({ messages, onClose }) {
  const [activeTab, setActiveTab] = useState("images");

  const images = useMemo(() => {
    return messages.filter((msg) => msg.image);
  }, [messages]);

  const videos = useMemo(() => {
    return messages.filter((msg) => msg.video);
  }, [messages]);

  const docs = useMemo(() => {
    return messages.filter((msg) => msg.document);
  }, [messages]);

  const tabMap = {
    images,
    videos,
    docs,
  };

  const activeItems = tabMap[activeTab];

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      {/* Panel */}
      <div className="w-full md:w-[420px] h-full bg-[#111827] border-l border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-white">Shared Media</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 transition"
          >
            <IoClose size={24} className="text-zinc-300" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          {["images", "videos", "docs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 capitalize transition ${
                activeTab === tab
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-zinc-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeItems.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-500">
              No {activeTab} shared
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {activeTab === "images" &&
                activeItems.map((item) => (
                  <img
                    key={item._id}
                    src={item.image}
                    alt=""
                    className="rounded-xl object-cover w-full h-40"
                  />
                ))}

              {activeTab === "videos" &&
                activeItems.map((item) => (
                  <video
                    key={item._id}
                    src={item.video}
                    controls
                    className="rounded-xl"
                  />
                ))}

              {activeTab === "docs" &&
                activeItems.map((item) => (
                  <a
                    key={item._id}
                    href={item.document}
                    target="_blank"
                    className="bg-zinc-800 p-4 rounded-xl text-white"
                  >
                    Document
                  </a>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaOverlay;