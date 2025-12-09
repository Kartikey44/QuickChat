"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ChatContext } from "../../context/userContext"

// Default avatar placeholder
const DefaultAvatar = "/user-profile-avatar.png"

function ProfileUpdate() {
  const [image, setImage] = useState(null)
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const { setProfile } = useContext(ChatContext)
  const navigate = useNavigate()

  useEffect(() => {
    const savedName = localStorage.getItem("profile_name")
    const savedBio = localStorage.getItem("profile_bio")
    const savedPhone = localStorage.getItem("profile_phone")
    const savedImage = localStorage.getItem("profile_image")

    if (savedName) setName(savedName)
    if (savedBio) setBio(savedBio)
    if (savedPhone) setPhone(savedPhone)
    if (savedImage) setImage(savedImage)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    const saveProfile = (finalImage) => {
      localStorage.setItem("profile_name", name)
      localStorage.setItem("profile_bio", bio)
      localStorage.setItem("profile_phone", phone)
      localStorage.setItem("profile_image", finalImage || DefaultAvatar)

      setProfile({
        name,
        bio,
        phone,
        image: finalImage || DefaultAvatar,
      })

      setTimeout(() => navigate("/chat"), 200)
    }

    if (image && typeof image !== "string") {
      const reader = new FileReader()
      reader.onloadend = () => saveProfile(reader.result)
      reader.readAsDataURL(image)
    } else {
      saveProfile(image)
    }
  }

  return (
    <div className="min-h-screen bg-[url('/BackgroundImage.png')] bg-cover bg-no-repeat flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="bg-white/20 backdrop-blur-lg flex items-center justify-center rounded-xl w-full max-w-sm sm:max-w-md shadow-xl">
        <form className="flex flex-col gap-4 sm:gap-5 p-6 sm:p-8 md:p-10 w-full" onSubmit={handleSubmit}>
          <h3 className="font-bold text-center text-white text-lg sm:text-xl">Profile Details</h3>

          <label htmlFor="avatar" className="flex cursor-pointer items-center justify-center gap-2">
            <input type="file" id="avatar" accept=".png,.jpg" hidden onChange={(e) => setImage(e.target.files[0])} />
            <img
              src={image ? (typeof image === "string" ? image : URL.createObjectURL(image)) : DefaultAvatar}
              className="rounded-full object-cover w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-blue-400 shadow-lg"
              alt="Profile"
            />
          </label>

          <input
            type="text"
            placeholder="Your name"
            className="p-2.5 sm:p-3 border-2 border-gray-500 w-full outline-blue-400 rounded-lg text-sm sm:text-base"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            pattern="[0-9]{10}"
            className="p-2.5 sm:p-3 border-2 border-gray-500 rounded-lg outline-blue-400 w-full text-sm sm:text-base no-spinner"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            placeholder="About"
            className="p-2.5 sm:p-3 border-2 border-gray-500 outline-blue-600 w-full rounded-lg text-sm sm:text-base min-h-[80px] sm:min-h-[100px] resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <button
            type="submit"
            className="rounded-xl sm:rounded-2xl p-2.5 sm:p-3 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-semibold text-sm sm:text-base transition-colors"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileUpdate
