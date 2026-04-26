import React from 'react'
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { BiMessageSquare } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';

function MinSideBar() {
    const { logout } = useAuth()
    const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
       <div className="hidden md:flex flex-col justify-between h-full py-6 bg-[#3c3c3c] shadow-2xl items-center">
        <div>
          <BiMessageSquare size={30} className="text-white cursor-pointer" />
        </div>
        <div className="flex flex-col items-center gap-5 pb-5 text-white">
        <CgProfile size={30} className='cursor-pointer hover:text-gray-300' />
        <IoMdSettings size={30} className='cursor-pointer hover:text-gray-300' />
        <LuLogOut 
          size={30} 
          className='cursor-pointer hover:text-red-400'
          onClick={handleLogout}
        />
          </div>
        </div>
  )
}

export default MinSideBar
