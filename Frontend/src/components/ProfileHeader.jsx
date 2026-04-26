import React, { useState } from 'react'
import { MdAddComment } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

function ProfileHeader() {

  return (
    <div className="flex justify-between px-3 relative"> 
      <p className="text-2xl font-bold text-fuchsia-600 ">
        Quick<span className="text-purple-400">Chat</span>
      </p>

      <div className="flex ">
        <MdAddComment size={25} className="text-white cursor-pointer" />
      </div>

    </div>
  )
}

export default ProfileHeader