import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { BiMessageSquare } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";

function MinSideBar({ setShowProfile }) {
  const { logout,authUser } = useAuth();

  return (
    <div className="hidden md:flex flex-col justify-between h-full py-6 bg-[#1d1f1f] shadow-2xl items-center">
      <div>
        <BiMessageSquare
          size={30}
          className="text-white cursor-pointer"
          onClick={() => {
            setShowProfile(false);
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
