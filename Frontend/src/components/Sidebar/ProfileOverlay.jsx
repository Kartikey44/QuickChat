import React, { useState, useEffect } from "react";
import Avatar from "../../assets/Avatar.png";

import { RiArrowRightLongLine } from "react-icons/ri";
import { GiCrossMark } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import axiosInstance from "../../lib/axios";

import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

import { profileFields } from "../../assets/profileFields";

import toast from "react-hot-toast";

function ProfileOverlay() {
  const { setShowProfile } = useData();

  const { authUser, setAuthUser } = useAuth();

  const user = authUser;

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(user?.profileimg || "");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  const [tempData, setTempData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (user) {
      const updated = {
        name: user.name || "",
        bio: user.bio || "",
        email: user.email || "",
        mobile: user.mobile || "",
      };

      setFormData(updated);

      setTempData(updated);

      setPreview(user.profileimg || "");
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onUpdate = (updatedData) => {
    setAuthUser((prev) => ({
      ...prev,
      name: updatedData.name ?? prev.name,

      bio: updatedData.bio ?? prev.bio,

      email: updatedData.email ?? prev.email,

      mobile: updatedData.mobile ?? prev.mobile,

      profileimg: updatedData.profileimg ?? prev.profileimg,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleEdit = (fieldKey) => {
    setEditingField(fieldKey);
  };

  const handleCancel = (fieldKey) => {
    setTempData((prev) => ({
      ...prev,
      [fieldKey]: formData[fieldKey],
    }));

    setEditingField(null);
  };

  const handleSave = (fieldKey) => {
    const value = tempData[fieldKey];

    if (fieldKey === "name" && value.trim().length < 3) {
      return toast.error("Name must be at least 3 characters");
    }

    if (fieldKey === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        return toast.error("Invalid email");
      }
    }

    if (fieldKey === "mobile" && value && !/^[6-9]\d{9}$/.test(value)) {
      return toast.error("Invalid mobile number");
    }

    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    setEditingField(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const submitData = new FormData();

      submitData.append("name", formData.name);

      submitData.append("bio", formData.bio);

      submitData.append("email", formData.email);

      submitData.append("mobile", formData.mobile);

      if (image) {
        submitData.append("image", image);
      }

      const res = await axiosInstance.post("/upload", submitData, {
        withCredentials: true,
      });

      const updatedUser = res.data.user || res.data;

      onUpdate(updatedUser);

      toast.success("Profile updated successfully");

      setShowProfile(false);
    } catch (err) {
      console.error(err.response?.data || err.message);

      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      {/* Modal */}
      <div className="bg-linear-to-br from-[#2a030a] via-[#400505] to-[#290000]  w-full md:h-screen border border-zinc-800   overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#271111]">
          <div>
            <h2 className="text-2xl font-bold text-white">My Profile</h2>

            <p className="text-sm text-zinc-400 mt-1">Manage your account</p>
          </div>

          <button
            onClick={() => setShowProfile(false)}
            className="p-2 rounded-full hover:bg-zinc-800 transition"
          >
            <IoClose size={24} className="text-zinc-300" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 no-scrollbar flex flex-col gap-5">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="fileInput"
            />

            <label
              htmlFor="fileInput"
              className="relative cursor-pointer group"
            >
              <img
                src={preview || Avatar}
                alt="profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-zinc-700"
              />

              <div className="absolute inset-0 rounded-full bg-[#ff4545] opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  Change Photo
                </span>
              </div>
            </label>

            <p className="text-sm text-zinc-400">Tap to change profile photo</p>
          </div>

          {/* Fields */}
          {profileFields.map((field) => {
            const Icon = field.icon;

            const isEditing = editingField === field.key;

            const value = isEditing ? tempData[field.key] : formData[field.key];

            return (
              <div
                key={field.key}
                className="bg-[#280f0f] border border-zinc-700 rounded-2xl p-4 flex flex-col gap-3 hover:border-zinc-500 transition"
              >
                {/* Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="text-zinc-400" />

                    <p className="text-sm text-zinc-400">{field.label}</p>
                  </div>

                  {!isEditing ? (
                    <FaPencilAlt
                      onClick={() => handleEdit(field.key)}
                      className="cursor-pointer text-zinc-300 hover:text-white"
                    />
                  ) : (
                    <div className="flex gap-4">
                      <GiCrossMark
                        onClick={() => handleCancel(field.key)}
                        className="text-red-500 cursor-pointer"
                      />

                      <RiArrowRightLongLine
                        onClick={() => handleSave(field.key)}
                        className="text-cyan-400 cursor-pointer text-2xl"
                      />
                    </div>
                  )}
                </div>

                {/* Input */}
                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={value}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setTempData((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="bg-transparent text-white outline-none resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={value}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setTempData((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="bg-transparent text-white outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#271111] border-t border-zinc-800 p-5 flex gap-4">
          <button
            onClick={() => setShowProfile(false)}
            className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-cyan-500 text-white hover:opacity-90 transition font-medium"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileOverlay;  