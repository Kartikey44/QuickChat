import React, { useRef, useEffect } from "react";

import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { TbMessageCircleFilled } from "react-icons/tb";
import { RiContactsBook3Fill } from "react-icons/ri";

import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useChat } from "../../context/ChatContext";

function MinSideBar() {
  const { logout, authUser } = useAuth();

  const { unreadCounts } = useChat();

  const {
    setShowProfile,
    setShowContacts,
    showContacts,
    openMenu,
    setOpenMenu,
  } = useData();

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

  const totalUnread = Object.values(unreadCounts || {}).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <div className="hidden md:flex flex-col justify-between h-screen w-20 lg:w-full bg-gradient-to-b from-[#1b0b0b] via-[#231010] to-[#120707] border-r border-[#3a1d1d] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="flex items-center justify-center lg:justify-start gap-3 px-4 py-6 border-b border-[#3a1d1d]">
          <img
            src="/Logo.png"
            alt="logo"
            className="w-11 h-11 object-contain drop-shadow-lg cursor-pointer"
          />
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-4 mt-8 px-2">
          {/* CHAT BUTTON */}
          <button
            onClick={() => {
              setShowProfile(false);

              setShowContacts(false);
            }}
            className={`group relative flex items-center justify-center p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
              !showContacts
                ? "shadow-lg shadow-black/30"
                : ""
            }`}
          >
            <div className="relative">
              <TbMessageCircleFilled
                size={38}
                className={`-rotate-90 transition-all duration-300 cursor-pointer ${
                  !showContacts
                    ? "text-white scale-105"
                    : "text-zinc-400 group-hover:text-zinc-200"
                }`}
              />

              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center text-[10px] font-bold bg-rose-500 text-white rounded-full shadow-lg animate-pulse">
                  {totalUnread}
                </span>
              )}
            </div>
          </button>

          {/* CONTACT BUTTON */}
          <button
            onClick={() => {
              setShowProfile(false);
              setShowContacts(true);
            }}
            className={`group flex items-center justify-center p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
              showContacts
                ? "shadow-lg shadow-black/30"
                : ""
            }`}
          >
            <RiContactsBook3Fill
              size={36}
              className={`transition-all duration-300 cursor-pointer ${
                showContacts
                  ? "text-white scale-105"
                  : "text-zinc-400 group-hover:text-zinc-200"
              }`}
            />
          </button>
        </div>
      </div>

      {/* BOTTOM */}
      <div
        ref={menuRef}
        className="relative flex flex-col items-center justify-center gap-5 pb-6"
      >
        {/* PROFILE */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="focus:outline-none cursor-pointer"
        >
          {authUser?.profileimg ? (
            <img
              src={authUser.profileimg}
              alt="profile"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#4b1f1f] shadow-lg hover:scale-105 hover:border-rose-400 transition-all duration-300 cursor-pointer"
            />
          ) : (
            <CgProfile
              size={40}
              className="text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer"
            />
          )}
        </button>

        {/* DROPDOWN */}
        {openMenu && (
          <div className="absolute bottom-15 left-16 lg:left-16 w-44 overflow-hidden rounded-2xl border border-[#4b1f1f] bg-[#2b1515]/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50 animate-in fade-in zoom-in-95 duration-200">
            {/* PROFILE */}
            <button
              onClick={() => {
                setShowProfile(true);

                setOpenMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-zinc-200 hover:bg-[#4b1f1f] hover:text-white transition-all duration-200 cursor-pointer"
            >
              My Profile
            </button>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-3 text-rose-400 hover:bg-[#4b1f1f] hover:text-rose-300 transition-all duration-200 cursor-pointer"
            >
              <LuLogOut size={18} className="cursor-pointer" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MinSideBar;
