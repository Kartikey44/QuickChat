"use client"

import { useState, useContext, useRef } from "react"
import { ChatContext } from "../../context/userContext"
import { fileToBase64 } from "../../lib/mediaUtils"

function AddContactModal({ onClose }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [error, setError] = useState("")
  const { addContact } = useContext(ChatContext)
  const fileInputRef = useRef(null)

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const base64 = await fileToBase64(file)
      setAvatar(base64)
      setAvatarPreview(base64)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Name is required")
      return
    }

    if (!phone.trim()) {
      setError("Phone number is required")
      return
    }

    addContact({
      name: name.trim(),
      phone: phone.trim(),
      avatar: avatar || "/diverse-user-avatars.png",
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h3 className="text-white font-semibold text-lg">Add New Contact</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors">
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Avatar upload */}
          <div className="flex justify-center">
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="relative group">
              <img
                src={avatarPreview || "/placeholder.svg?height=80&width=80&query=user avatar"}
                alt="Contact avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700 group-hover:border-pink-500 transition-colors"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <input
            type="text"
            placeholder="Contact name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 transition-colors"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddContactModal
