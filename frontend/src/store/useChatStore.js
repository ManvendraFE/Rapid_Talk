import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';

export const useChatStore = create((set, get)=>({
   allContacts:[],
   chats:[],
   messages:[],
   selectedUsed:null,
   isUsersLoading:false,
   isMessagesLoading:false,
   isSoundEnabled:localStorage.getItem('soundEnabled') === 'true',

   toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled); 
    set({isSoundEnabled: !get().isSoundEnabled})
   }, 

   setActiveTab: (tab) => set({activeTab: tab}),
   setSelectedUser: (selectedUser) => set({selectedUser}),

   getAllContacts: async () => {
    set({isUsersLoading: true});
    try{
      const res = await axiosInstance.get("/messages/contacts");
      set({allContacts: res.data});
    } catch (error) {
      console.error("Error fetching contacts:", error.response.data.message);
    } finally {
      set({isUsersLoading: false});
    }
   },
   getMyChatPartners: async () => {
     set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
   }, 
     
}))