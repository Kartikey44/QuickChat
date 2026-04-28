import React, { useState ,useRef} from 'react'
import { MdAddComment } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import SearchBar from '../components/SearchBar'
import ActiveTabSwitch from './ActiveTabSwitch';
import { useAuth } from '../context/AuthContext';
function ProfileHeader() {
  const { updateProfile, authUser } = useAuth();
  const [selectedImg, setSelectedImg] = useState(null)
  const fileInputRef=useRef(null)
  return (

    <div className='w-full flex flex-col gap-4'>
    <div className="flex justify-between px-1 relative"> 
      <p className="text-3xl font-bold bg-linear-to-r from-[#0f7ee8] via-[#8c288d] to-[#d20a70] bg-clip-text text-transparent ">
        QuickChat
      </p>

      <div className="flex ">
        <MdAddComment size={25} className="text-white cursor-pointer" />
      </div>
      </div>
      <SearchBar />
      <ActiveTabSwitch />
      <div className=''>
        <div className=''>

        </div>
        <div className=''>

        </div>
      </div>
      </div>
  )
}

export default ProfileHeader