"use client"

import { createContext, useState, useEffect } from "react"

export const ChatContext = createContext()

const defaultContacts = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    avatar: "/thoughtful-man-glasses.png",
    online: true,
    phone: "1234567890",
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "See you tomorrow!",
    avatar: "/diverse-woman-smiling.png",
    online: false,
    phone: "0987654321",
  },
  {
    id: 3,
    name: "Mike Johnson",
    lastMessage: "Thanks for the help!",
    avatar: "/casual-man.png",
    online: true,
    phone: "5555555555",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    lastMessage: "Let me know when free",
    avatar: "/professional-woman.png",
    online: true,
    phone: "4444444444",
  },
  {
    id: 5,
    name: "Alex Brown",
    lastMessage: "Got it!",
    avatar: "/person-neutral.jpg",
    online: false,
    phone: "3333333333",
  },
]

export function ChatProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [contacts, setContacts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState({})
  const [media, setMedia] = useState({}) // Media storage per chat

  useEffect(() => {
    const savedProfile = localStorage.getItem("quickchat_profile")
    const savedContacts = localStorage.getItem("quickchat_contacts")
    const savedMessages = localStorage.getItem("quickchat_messages")
    const savedMedia = localStorage.getItem("quickchat_media")

    if (savedProfile) setProfile(JSON.parse(savedProfile))
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    } else {
      setContacts(defaultContacts)
      localStorage.setItem("quickchat_contacts", JSON.stringify(defaultContacts))
    }
    if (savedMessages) setMessages(JSON.parse(savedMessages))
    if (savedMedia) setMedia(JSON.parse(savedMedia))
  }, [])

  useEffect(() => {
    if (profile) localStorage.setItem("quickchat_profile", JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    if (contacts.length > 0) localStorage.setItem("quickchat_contacts", JSON.stringify(contacts))
  }, [contacts])

  useEffect(() => {
    if (Object.keys(messages).length > 0) localStorage.setItem("quickchat_messages", JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (Object.keys(media).length > 0) localStorage.setItem("quickchat_media", JSON.stringify(media))
  }, [media])

  const addMessage = (userId, message) => {
    setMessages((prev) => {
      const updated = {
        ...prev,
        [userId]: [...(prev[userId] || []), message],
      }
      return updated
    })

    if (message.media) {
      addMedia(userId, message.media)
    }
  }

  const addContact = (contact) => {
    const newContact = {
      ...contact,
      id: Date.now(),
      lastMessage: "New contact",
      online: false,
    }
    setContacts((prev) => [...prev, newContact])
    return newContact
  }

  const updateContactLastMessage = (userId, lastMessage) => {
    setContacts((prev) => prev.map((contact) => (contact.id === userId ? { ...contact, lastMessage } : contact)))
  }

  const addMedia = (userId, mediaItem) => {
    setMedia((prev) => ({
      ...prev,
      [userId]: [...(prev[userId] || []), mediaItem],
    }))
  }

  const getChatMedia = (userId) => {
    return media[userId] || []
  }

  return (
    <ChatContext.Provider
      value={{
        profile,
        setProfile,
        contacts,
        setContacts,
        addContact,
        selectedUser,
        setSelectedUser,
        messages,
        addMessage,
        updateContactLastMessage,
        media,
        addMedia,
        getChatMedia,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
