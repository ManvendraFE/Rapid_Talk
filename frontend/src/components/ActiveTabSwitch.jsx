import React from 'react'
import { useChatStore } from '../store/useChatStore.js';

function ActiveTabSwitch() {

  const {activeTab, setActiveTab} = useChatStore(); 


  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button onClick={()=> setActiveTab("chats")}
        className={`tab ${activeTab === "chats"? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`} // agr active tab chats h to chats button ka background cyan hoga otherwise text slate color hoga
        >Chats</button>
      <button onClick={()=> setActiveTab("contacts")}
        className={`tab ${activeTab === "contacts"? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`} // agr active tab contacts h to contacts button ka background cyan hoga otherwise text slate color hoga
        >Contacts</button>
    </div>
  )
}

export default ActiveTabSwitch
