import React,{useState} from 'react'
import AllChats from './AllChats';
import UnreadChats from './UnreadChats';
import ProfileOverlay from './ProfileOverlay';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import ProfileHeader from './ProfileHeader';
function SideBar() {
    const [showProfile, setShowProfile] = useState(false);
    const {activeTab} =useChat()
    const { logout, authUser, setAuthUser } = useAuth();
    
  return (
    <div className="w-full md:w-100 border-r border-[#343636] flex flex-col relative">
      <div className="p-4">
        <ProfileHeader />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === "all" ? <AllChats /> : <UnreadChats />}
      </div>

      {/* Profile Overlay */}
      {showProfile && (
        <ProfileOverlay
          user={authUser}
          onClose={() => {
            setShowProfile(false);
          }}
          onUpdate={(updatedData) => {
            setAuthUser((prev) => ({
              ...prev,
              bio: updatedData.bio || prev.bio,
              name: updatedData.name || prev.name,
              profileimg: updatedData.profileimg || prev.profileimg,
            }));
          }}
        />
      )}
    </div>
  );
}

export default SideBar
