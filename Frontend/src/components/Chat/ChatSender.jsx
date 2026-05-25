import React, { useState, useRef, useEffect } from "react";
import { ImagePlus, SendHorizonal, X } from "lucide-react";

import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

function ChatSender() {
  const [tempMessage, setTempMessage] = useState("");

  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const typingRef = useRef(null);

  const { selectedUser, sendMessage } = useChat();

  const { socket } = useAuth();

  const handleSend = async () => {
    if (!selectedUser?._id) return;

    if (!tempMessage.trim() && !file) return;

    try {
      await sendMessage({
        content: tempMessage,
        receiverId: selectedUser._id,
        file,
      });

      setTempMessage("");
      setFile(null);
      setPreview(null);

      socket?.emit("stopTyping", {
        receiverId: selectedUser._id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleTyping = () => {
    if (!selectedUser || !socket) return;

    socket.emit("typing", {
      receiverId: selectedUser._id,
    });

    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }

    typingRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: selectedUser._id,
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, []);

  return (
    <>
      {preview && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="absolute top-[-120px] left-[20%] w-[300px] h-[300px] bg-red-700/20 blur-3xl rounded-full"></div>

          <div className="absolute bottom-[-120px] right-[10%] w-[300px] h-[300px] bg-pink-700/20 blur-3xl rounded-full"></div>

          <div className="relative w-full max-w-4xl max-h-[95vh] bg-[#140107]/95 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-white/10 bg-white/5 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/20 flex items-center justify-center">
                  <ImagePlus size={24} className="text-red-300" />
                </div>

                <div>
                  <h2 className="text-white font-semibold text-lg">
                    Media Preview
                  </h2>

                  <p className="text-zinc-400 text-sm">Ready to send image</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 flex items-center justify-center transition-all duration-300"
              >
                <X size={20} className="text-zinc-300" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-5">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-h-[50vh] md:max-h-[65vh] object-contain"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Selected Image</p>

                    <p className="text-zinc-400 text-sm">
                      High quality preview ready
                    </p>
                  </div>

                  <div className="hidden md:flex px-4 py-2 rounded-2xl bg-white/10 border border-white/10 text-white text-sm backdrop-blur-lg">
                    Image Attached
                  </div>
                </div>
              </div>

              {tempMessage && (
                <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-zinc-400 text-sm mb-2">Caption</p>

                  <p className="text-white break-words leading-relaxed">
                    {tempMessage}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSend}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold shadow-lg shadow-red-900/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <SendHorizonal size={18} />
                  Send Media
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl px-4 py-3 shadow-2xl">
          <label className="group flex items-center justify-center min-w-[48px] h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 cursor-pointer transition-all duration-300">
            <ImagePlus
              size={22}
              className="text-zinc-300 group-hover:text-red-300 transition"
            />

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files[0];

                if (selectedFile) {
                  setFile(selectedFile);

                  setPreview(URL.createObjectURL(selectedFile));
                }
              }}
            />
          </label>

          <div className="flex-1">
            <input
              type="text"
              value={tempMessage}
              onChange={(e) => {
                setTempMessage(e.target.value);

                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="w-full bg-transparent text-white placeholder:text-zinc-500 outline-none text-[15px]"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!tempMessage.trim() && !file}
            className={`min-w-[52px] h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
              tempMessage.trim() || file
                ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-red-900/40"
                : "bg-white/5 border border-white/10 cursor-not-allowed"
            }`}
          >
            <SendHorizonal
              size={20}
              className={`${
                tempMessage.trim() || file ? "text-white" : "text-zinc-500"
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatSender;
