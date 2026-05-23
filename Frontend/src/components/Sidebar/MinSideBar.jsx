import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { TbMessageCircleFilled } from "react-icons/tb";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

function MinSideBar() {
  const { logout, authUser } = useAuth();
  const { setShowProfile, setShowContacts } = useData();
  return (
    <div className="hidden md:flex flex-col justify-between h-full py-6 bg-linear-to-br from-[#1f001e] to-[#210010] shadow-2xl items-center">
      <img src="./Logo.png " alt="" className="w-12 h-12 fixed top-2 " />
      <div className="flex flex-col items-end justify-end ">
        
        <TbMessageCircleFilled
          size={40}
          className="text-gray-400 mt-15 cursor-pointer"
          onClick={() => {
            setShowProfile(false);
            setShowContacts(false);
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-5 pb-5 text-white">
        {authUser?.profileimg ? (
          <img
            src={authUser.profileimg}
            alt="profile"
            onClick={() => setShowProfile(true)}
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
          />
        ) : (
          <CgProfile
            size={30}
            className="cursor-pointer hover:text-gray-300"
            onClick={() => setShowProfile(true)}
          />
        )}

        <LuLogOut
          size={30}
          className="cursor-pointer hover:text-red-400"
          onClick={logout}
        />
      </div>
    </div>
  );
}
export default MinSideBar;
