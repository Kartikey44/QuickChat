import React, { useState, useEffect } from "react";
import Avatar from "../assets/Avatar.png";
import { RiArrowRightLongLine } from "react-icons/ri";
import { GiCrossMark } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import axiosInstance from "../lib/axios";
import toast from 'react-hot-toast'

function ProfileOverlay({ user, onClose, onUpdate }) {
  const [name, setName] = useState(user.name || "");
  const [tempName, setTempName] = useState(user.name || "");
  const [isEditingName, setIsEditingName] = useState(false);

  const [bio, setBio] = useState(user.bio || "");
  const [tempBio, setTempBio] = useState(user.bio || "");
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user.profileimg || "");

  const [loading, setLoading] = useState(false);

  const handleEditName = () => {
    setTempName(name);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (tempName.length < 3) {
      toast.error("Name must have at least 3 characters.")
      return;
    }
    setName(tempName);
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  const handleEditBio = () => {
    setTempBio(bio);
    setIsEditingBio(true);
  };

  const handleSaveBio = () => {
    setBio(tempBio);
    setIsEditingBio(false);
  };

  const handleCancelBio = () => {
    setTempBio(bio);
    setIsEditingBio(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      if (name) formData.append("name", name);
      if (bio) formData.append("bio", bio);
      if (image) formData.append("image", image);

      const res = await axiosInstance.post("/upload", formData, {
        withCredentials: true,
      });

      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f] p-6 w-full h-full flex flex-col gap-6">
        <h2 className="text-white text-lg font-semibold">{name}</h2>

        <div className="flex flex-col items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="fileInput"
          />

          <label htmlFor="fileInput" className="cursor-pointer">
            <img
              src={preview || Avatar}
              alt="profile"
              className="w-40 h-40 rounded-full object-cover border border-white/20"
            />
          </label>
        </div>
        <p>Name</p>
        <div
          className={`flex justify-between rounded-2xl text-sm text-white ${isEditingName ? "bg-black/80" : ""}`}
        >
          <input
            className="w-full p-2 bg-transparent outline-none"
            value={isEditingName ? tempName : name}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveName();
              }
            }}
            readOnly={!isEditingName}
          />

          <div className="flex gap-5 items-center pr-3">
            {!isEditingName ? (
              <FaPencilAlt
                onClick={handleEditName}
                className="cursor-pointer"
              />
            ) : (
              <>
                <GiCrossMark
                  onClick={handleCancelName}
                  className="text-red-500 cursor-pointer"
                />
                <RiArrowRightLongLine
                  onClick={handleSaveName}
                  className="text-cyan-500 cursor-pointer"
                />
              </>
            )}
          </div>
        </div>
        <p>Bio </p>
        <div
          className={`flex justify-between  rounded-2xl text-sm text-white ${isEditingBio ? "bg-black/80" : ""}`}
        >
          <input
            className="w-full p-2 bg-transparent outline-none"
            value={isEditingBio ? tempBio : bio}
            onChange={(e) => setTempBio(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveBio();
              }
            }}
            readOnly={!isEditingBio}
          />

          <div className="flex gap-5 items-center pr-3">
            {!isEditingBio ? (
              <FaPencilAlt onClick={handleEditBio} className="cursor-pointer" />
            ) : (
              <>
                <GiCrossMark
                  onClick={handleCancelBio}
                  className="text-red-500 cursor-pointer"
                />
                <RiArrowRightLongLine
                  onClick={handleSaveBio}
                  className="text-cyan-500 cursor-pointer"
                />
              </>
            )}
          </div>
        </div>

        <div className="absolute left-5 bottom-5 right-5 gap-50 flex justify-between p-5">
          <div
            onClick={onClose}
            className="border p-2 w-20 text-white/80 text-center hover:border-0 hover:bg-red-500/50 cursor-pointer rounded-lg"
          >
            Cancel
          </div>

          <div
            onClick={handleSubmit}
            className="border p-2 w-20 text-white/80 text-center hover:border-0 hover:bg-cyan-500/70 cursor-pointer rounded-lg"
          >
            {loading ? "Saving..." : "Save"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileOverlay;
