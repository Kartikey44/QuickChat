import React from "react";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { TbMessageCircleFilled } from "react-icons/tb";
import { RiContactsBook3Fill } from "react-icons/ri";
import { useState,useRef,useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useChat } from "../../context/ChatContext";

function MinSideBar() {
  const { logout, authUser } = useAuth();
  const {unreadCounts}=useChat()
  const { setShowProfile, setShowContacts,openMenu,setOpenMenu } = useData();
  const menuRef = useRef();
   useEffect(() => {
     const handleClickOutside = (e) => {
       if (menuRef.current && !menuRef.current.contains(e.target)) {
         setOpenMenu(false);
       }
     };

     document.addEventListener("mousedown", handleClickOutside);

     return () => {
       document.removeEventListener("mousedown", handleClickOutside);
     };
   }, []);
  return (
    <div className="hidden md:flex flex-col justify-between h-screen w-40 lg:w-full bg-[#271111] border-r border-zinc-800 shadow-xl">
      <div>
        {/* Logo */}
        <div className="flex items-center px-2 justify-center lg:justify-start gap-2 py-6 border-b border-zinc-800">
          <img src="./Logo.png" alt="logo" className="w-6 h-6" />

          <h1 className="hidden lg:block font-bold text-white">
            Quick
            <span className="text-red-500">Chat</span>
          </h1>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-3 mt-8 ">
          <button
            onClick={() => {
              setShowProfile(false);

              setShowContacts(false);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-zinc-800 transition-all duration-200 text-zinc-300 hover:text-white"
          >
            <div className="relative">
              <TbMessageCircleFilled size={20} className="-rotate-90" />

              {Object.values(unreadCounts || {}).reduce((a, b) => a + b, 0) >
                0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-red-600 text-white rounded-full">
                  {Object.values(unreadCounts || {}).reduce((a, b) => a + b, 0)}
                </span>
              )}
            </div>

            <span className="hidden lg:block text-base font-medium">Chats</span>
          </button>

          {/* Contacts */}
          <button
            onClick={() => {
              setShowProfile(false);
              setShowContacts(true);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-zinc-800 transition-all duration-200 text-zinc-300 hover:text-white"
          >
            <RiContactsBook3Fill size={20} />

            <span className="hidden lg:block text-base font-medium">
              Contacts
            </span>
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div
        className="relative flex flex-col items-center gap-5 pb-6"
        ref={menuRef}
      >
        {/* Profile Button */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="focus:outline-none"
        >
          {authUser?.profileimg ? (
            <img
              src={authUser.profileimg}
              alt="profile"
              className="w-11 h-11 rounded-full object-cover border-2 border-zinc-700 hover:scale-105 transition"
            />
          ) : (
            <CgProfile size={34} className="text-zinc-300 hover:text-white" />
          )}
        </button>

        {/* Dropdown */}
        {openMenu && (
          <div className="absolute bottom-15 left-16 lg:left-16 w-40 bg-[#371f1f] border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-50">
            {/* My Profile */}
            <button
              onClick={() => {
                setShowProfile(true);
                setOpenMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-zinc-200 hover:bg-zinc-800 transition"
            >
              My Profile
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-zinc-800 transition"
            >
              <LuLogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MinSideBar;
