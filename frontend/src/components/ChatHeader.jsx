import React from 'react'
import {XIcon} from "lucide-react"; 
import {useChatStore} from "../store/useChatStore"
import { useAuthStore } from '../store/useAuthStore.js';
import { useEffect } from 'react';
function ChatHeader(){
  const {selectedUser, setSelectedUser} = useChatStore(); 
  const {onlineUsers} = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id); // JO user online hai uska id onlineUsers array me hoga to isOnline true hoga otherwise false hoga

  useEffect(()=> {
   // Jab Esc key press krenge to current user hatt jayega 
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    }
    window.addEventListener("keydown", handleEscKey)


    return() => window.removeEventListener("keydown", handleEscKey)
  },[setSelectedUser])

  return <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1 ">

    <div className='flex items-center space-x-3'>
      <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img src={selectedUser.ProfilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
      </div>
      <div>
        <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3>
        <p className='text-slate-400 text-sm'>{isOnline ? "Online" : "Offline"}</p>
      </div>
    </div>
    <button onClick={()=> setSelectedUser(null)}>
      <XIcon className="size-6 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"/>
    </button>
  </div>; 
}
export default ChatHeader;
 