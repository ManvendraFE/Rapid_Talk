import React from 'react'
import { useEffect } from 'react'
import  UsersLoadingSkeleton from './UserLoadingSkeleton.jsx'
import NoChatsFound from './NoChatsFound.jsx'
import {useChatStore} from '../store/useChatStore.js'
 
function ChatsList() {
  const {getMyChatPartners , chats, isUserLoading, setSelectedUser} = useChatStore();
  const {onlineUsers} = useAuthStore();


  useEffect (() => {
    getMyChatPartners(); 
  }, [getMyChatPartners]) // calling our method to grt chat partner

  if(isUserLoading) return <UsersLoadingSkeleton/>;
  if(chats.length === 0) return <NoChatsFound/>;

  return (
    <div>
       {chats.map(chat => (
        <div key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colours"
          onClick={() => setSelectedUser(chat)}
        > 
          <div className='flex items-center gap-3'>
            {/* TODO: FIX THIS ONLINE STATUS AND MAKE IT WORK WITH SOCKET */}
            <div className={`avatar ${onlineUsers.includes(chat._id)? "online": "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>
            <h4 className='text-slate-200 font-medium, trucate'>{chat.fullName}</h4>
          </div>
        </div> 
       ) )}
    </div>
  )
}

export default ChatsList

 