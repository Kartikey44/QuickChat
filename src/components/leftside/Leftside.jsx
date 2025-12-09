"use client"

import { useState, useContext } from "react"
import { ChatContext } from "../../context/userContext"
import { useNavigate } from "react-router-dom"
import AddContactModal from "./AddContactModal"

function Leftside({ className, showSidebar, setShowSidebar }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddContact, setShowAddContact] = useState(false)
  const { profile, contacts, selectedUser, setSelectedUser } = useContext(ChatContext)
  const navigate = useNavigate()

  const filteredUsers = contacts.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setShowSidebar(false)
  }

  return (
    <div className={`${className} bg-zinc-900 flex flex-col h-full md:h-auto md:min-h-full`}>
      {/* Header with profile */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-zinc-700">
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80"
          onClick={() => navigate("/profile")}
        >
          <img
            src={profile?.image || "/placeholder.svg?height=40&width=40&query=user avatar"}
            alt="Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-pink-500"
          />
          <div className="hidden sm:block">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate max-w-[120px] lg:max-w-[180px]">
              {profile?.name || "Your Name"}
            </h3>
            <p className="text-zinc-400 text-xs truncate max-w-[120px] lg:max-w-[180px]">
              {profile?.bio || "Set your status"}
            </p>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => setShowAddContact(true)}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            title="Add new contact"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="p-2 sm:p-3">
        <div className="relative">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800 text-white pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-zinc-500">
            <p className="text-sm">No contacts found</p>
            <button onClick={() => setShowAddContact(true)} className="text-pink-500 text-sm mt-2 hover:underline">
              Add a new contact
            </button>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer hover:bg-zinc-800 transition-colors ${
                selectedUser?.id === user.id ? "bg-zinc-800" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-zinc-900 rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm sm:text-base truncate">{user.name}</h4>
                <p className="text-zinc-400 text-xs sm:text-sm truncate">{user.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddContact && <AddContactModal onClose={() => setShowAddContact(false)} />}
    </div>
  )
}

export default Leftside
