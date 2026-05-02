import React, { useState, useRef } from "react";
import { MdAddComment } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import SearchBar from "../Chat/ChatSearchBar";
import ActiveTabSwitch from "./ActiveTabSwitch";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import ProfileOverlay from "./ProfileOverlay";
function ProfileHeader() {
  const { updateProfile, authUser } = useAuth();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);
  const { showContacts, setShowContacts } = useData();
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between px-1 relative">
        <p className="text-3xl font-bold bg-gradient-to-r from-[#0f7ee8] via-[#8c288d] to-[#d20a70] bg-clip-text text-transparent">
          QuickChat
        </p>

        <div className="flex ">
          <MdAddComment
            size={25}
            className="text-white cursor-pointer"
            onClick={() => setShowContacts(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
