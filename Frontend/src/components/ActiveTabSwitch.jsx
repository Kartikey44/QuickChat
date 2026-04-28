import React from 'react'
import { useChat } from '../context/ChatContext'

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChat()

  return (
    <div className='flex gap-4 px-4 text-center text-white'>
      
      <span
        onClick={() => setActiveTab("all")}
        className={`cursor-pointer border border-white/10 rounded-full text-sm px-4 ${
          activeTab === "all" ? "bg-fuchsia-600" : "bg-[#191919]"
        }`}
      >
        All
      </span>

      <span
        onClick={() => setActiveTab("unread")}
        className={`cursor-pointer border border-white/10 rounded-full px-4 text-sm ${
          activeTab === "unread" ? "bg-fuchsia-600" : "bg-[#191919]"
        }`}
      >
        Unread
      </span>
    </div>
  )
}

export default ActiveTabSwitch