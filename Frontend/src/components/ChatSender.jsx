import React, { useState, useRef, useEffect } from "react";
import { MdOutlinePermMedia } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
import { useChat } from "../context/ChatContext";

function ChatSender() {
  const [tempMessage, setTempMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isChatting, setIsChatting] = useState(false);

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
 };

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
            onChange={(e) => setFile(e.target.files[0])} // ✅ fix
          />
        </label>

        {isChatting && (
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
