import React, { useState, useRef, useEffect } from "react";
import { MdOutlinePermMedia } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
import { useChat } from "../context/ChatContext";

function ChatSender() {
  const [tempMessage, setTempMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isChatting, setIsChatting] = useState(false);
  const [preview, setPreview] = useState(null);
  const containerRef = useRef(null);

  const { selectedUser, sendMessage } = useChat();
const handleSend = async () => {
  if (!tempMessage.trim() && !file) return;

  await sendMessage({
    content: tempMessage,
    receiverId: selectedUser._id,
    image: file,
  });

  setTempMessage("");
  setFile(null);
  setPreview(null); 
};

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsChatting(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex px-5 h-full w-full rounded-full shadow-2xl justify-between items-center bg-transparent border border-x-0 border-y-white/20"
    >
      <input
        type="text"
        onClick={() => setIsChatting(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        value={tempMessage}
        onChange={(e) => setTempMessage(e.target.value)}
        placeholder="Type a message"
        className="h-full w-full text-base bg-transparent outline-none px-4"
      />

      <div className="flex items-center gap-7">
        <label className="cursor-pointer">
          <MdOutlinePermMedia
            size={30}
            className="text-white hover:text-cyan-400"
          />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files[0];

              if (selectedFile) {
                setFile(selectedFile);
                setPreview(URL.createObjectURL(selectedFile)); // 🔥 preview URL
                setIsChatting(true); // show send button
              }
            }}
          />
        </label>
        {preview && (
          <div className=" fixed top-18 right-0 w-130 h-140 bg-gray-800 p-2 rounded-lg shadow-lg">
            <img
              src={preview}
              alt="preview"
              className="w-full h-full p-10 object-cover rounded"
            />

            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="text-red-400 text-xs mt-1"
            >
              Remove
            </button>
          </div>
        )}
        {(isChatting || file) && (
          <button
            className="bg-cyan-500 rounded-full p-2 cursor-pointer"
            onClick={handleSend}
          >
            <BsFillSendFill size={18} className="text-black" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatSender;
