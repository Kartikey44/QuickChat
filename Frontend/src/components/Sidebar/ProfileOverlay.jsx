import React, { useState, useEffect } from "react";
import Avatar from "../../assets/Avatar.png";
import { RiArrowRightLongLine } from "react-icons/ri";
import { GiCrossMark } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import axiosInstance from "../../lib/axios";
import { useData } from "../../context/DataContext";
import { profileFields } from "../../assets/profileFields";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
function ProfileOverlay() {
  const { setShowProfile } = useData();
  const { authUser, setAuthUser } = useAuth();
  const user = authUser;
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileimg || "");
  const [name, setName] = useState(user?.name || "");
  const [tempName, setTempName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [tempBio, setTempBio] = useState(user?.bio || "");
  const [email, setEmail] = useState(user?.email || "");
  const [tempEmail, setTempEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [tempMobile, setTempMobile] = useState(user?.mobile || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setTempName(user.name || "");

      setBio(user.bio || "");
      setTempBio(user.bio || "");

      setEmail(user.email || "");
      setTempEmail(user.email || "");

      setMobile(user.mobile || "");
      setTempMobile(user.mobile || "");

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("email", email);
      formData.append("mobile", mobile);
      if (image) {
        formData.append("image", image);
      }

      const res = await axiosInstance.post("/upload", formData, {
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
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f] w-full h-full  rounded-none flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 ">
          <h2 className="text-white text-xl font-semibold">Profile</h2>

          <button
            onClick={() => setShowProfile(false)}
            className="text-white/70 hover:text-red-400 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 no-scrollbar smooth-scroll flex flex-col gap-5">
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
              className="cursor-pointer relative group"
            >
              <img
                src={preview || Avatar}
                alt="profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-white/10"
              />

              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <span className="text-white text-sm">Change Photo</span>
              </div>
            </label>

            <p className="text-gray-400 text-sm">Tap to change profile photo</p>
          </div>

          {profileFields.map((field) => {
            const Icon = field.icon;

            const editMap = {
              name: isEditingName,
              bio: isEditingBio,
              email: isEditingEmail,
              mobile: isEditingMobile,
            };

            const valueMap = {
              name: isEditingName ? tempName : name,

              bio: isEditingBio ? tempBio : bio,

              email: isEditingEmail ? tempEmail : email,

              mobile: isEditingMobile ? tempMobile : mobile,
            };

            const handleEditMap = {
              name: () => setIsEditingName(true),

              bio: () => setIsEditingBio(true),

              email: () => setIsEditingEmail(true),

              mobile: () => setIsEditingMobile(true),
            };

            const handleSaveMap = {
              name: () => {
                if (tempName.trim().length < 3) {
                  return toast.error("Name must be at least 3 characters");
                }

                setName(tempName);

                setIsEditingName(false);
              },

              bio: () => {
                setBio(tempBio);

                setIsEditingBio(false);
              },

              email: () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(tempEmail)) {
                  return toast.error("Invalid email");
                }

                setEmail(tempEmail);

                setIsEditingEmail(false);
              },

              mobile: () => {
                if (tempMobile && !/^[6-9]\d{9}$/.test(tempMobile)) {
                  return toast.error("Invalid mobile number");
                }

                setMobile(tempMobile);

                setIsEditingMobile(false);
              },
            };

            const handleCancelMap = {
              name: () => {
                setTempName(name);

                setIsEditingName(false);
              },

              bio: () => {
                setTempBio(bio);

                setIsEditingBio(false);
              },

              email: () => {
                setTempEmail(email);

                setIsEditingEmail(false);
              },

              mobile: () => {
                setTempMobile(mobile);

                setIsEditingMobile(false);
              },
            };

            const handleChangeMap = {
              name: setTempName,

              bio: setTempBio,

              email: setTempEmail,

              mobile: setTempMobile,
            };

            const isEditing = editMap[field.key];

            const value = valueMap[field.key] || "";

            const handleEdit = handleEditMap[field.key];

            const handleSave = handleSaveMap[field.key];

            const handleCancel = handleCancelMap[field.key];

            const handleChangeField = handleChangeMap[field.key];

            return (
              <div
                key={field.key}
                className="bg-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-2 text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="text-gray-400" />

                    <p className="text-sm text-gray-400">{field.label}</p>
                  </div>

                  {!isEditing ? (
                    <FaPencilAlt
                      onClick={handleEdit}
                      className="cursor-pointer text-white/70"
                    />
                  ) : (
                    <div className="flex gap-4">
                      <GiCrossMark
                        onClick={handleCancel}
                        className="text-red-500 cursor-pointer"
                      />

                      <RiArrowRightLongLine
                        onClick={handleSave}
                        className="text-cyan-400 cursor-pointer text-xl"
                      />
                    </div>
                  )}
                </div>

                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    className="bg-transparent outline-none resize-none"
                    value={value}
                    onChange={(e) => handleChangeField(e.target.value)}
                    readOnly={!isEditing}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={value}
                    onChange={(e) => handleChangeField(e.target.value)}
                    readOnly={!isEditing}
                    className="bg-transparent outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="p-5 flex justify-between gap-4">
          <button
            onClick={() => setShowProfile(false)}
            className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileOverlay;
