import React from "react";
import { LuMessageCircleMore } from "react-icons/lu";

function NoChatContainer() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex gap-12">
        <div className="flex flex-col items-center gap-3 cursor-pointer">
          <div className="bg-cyan-900/10 w-120 h-80 rounded-[70%] flex gap-5 flex-col items-center justify-center">
            <LuMessageCircleMore size={80} className="text-cyan-700" />
            <p className="text-cyan-400 font-semibold text-2xl">No conversation started yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoChatContainer;