"use client"

import { useState } from "react"
import Chatbox from "../../components/chatbox/Chatbox"
import Leftside from "../../components/leftside/Leftside"

function Chat() {
  const [showSidebar, setShowSidebar] = useState(true)

  return (
    <div className="min-h-screen h-screen bg-[linear-gradient(#ff0077,#ff3388,#dd0099)] flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-7xl h-[95vh] sm:h-[90vh] flex flex-col md:flex-row rounded-xl overflow-hidden">
        <div
          className={`${showSidebar ? "flex" : "hidden"} md:flex w-full md:w-80 lg:w-96 h-full md:h-full flex-shrink-0`}
        >
          <Leftside className="w-full h-full" showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        </div>
        <div className={`${!showSidebar ? "flex" : "hidden"} md:flex flex-1 h-full md:h-full`}>
          <Chatbox className="w-full h-full" showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        </div>
      </div>
    </div>
  )
}

export default Chat
