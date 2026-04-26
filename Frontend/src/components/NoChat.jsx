import React from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiUserAddFill } from "react-icons/ri";

function NoChat() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex gap-12">
        <div className="flex flex-col items-center gap-3 cursor-pointer group">
          <div className="bg-[#3c3c3c] p-8 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-[#4a4a4a]">
            <IoDocumentTextOutline
              size={20}
              className="text-white/50 group-hover:text-white"
            />
          </div>
          <p className="text-sm text-white/60 group-hover:text-white">
            Send Document
          </p>
        </div>


        <div className="flex flex-col items-center gap-3 cursor-pointer group">
          <div className="bg-[#3c3c3c] p-8 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-[#4a4a4a]">
            <RiUserAddFill
              size={20}
              className="text-white/50 group-hover:text-white"
            />
          </div>
          <p className="text-sm text-white/60 group-hover:text-white">
            Add Contact
          </p>
        </div>

      </div>
    </div>
  );
}

export default NoChat;