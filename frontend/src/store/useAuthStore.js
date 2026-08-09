import {create} from 'zustand' ;
import {axiosInstance} from "../lib/axios.js"
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get)=>({
   authUser: null, // if user is authenticated we can set user object here
   isCheckingAuth: true,
   isSigningUp: false,
   isLoggingIn: false,
   socket:null,
   onlineUsers:[],

   checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({authUser: res.data})
       get().connectSocket()
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({authUser:null})
    }finally{
      set({isCheckingAuth: false});
    }
   },

   signup: async(data)=>{  // data is the formData from SignUpPage.jsx 
    set({ isSigningUp: true})
    try {
     const res = await axiosInstance.post("/auth/signup", data);

     set({authUser: res.data});

     toast.success("Account created successfully!")
     get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message)// we can access to the error in Axios
    }finally {
      set({ isSigningUp: false})
    }
   } ,
   login: async(data)=>{  // data is the formData from LoginPage.jsx 
    set({ isLoggingIn: true})
    try {
     const res = await axiosInstance.post("/auth/login", data);

     set({authUser: res.data});

     toast.success("Logged in successfully")
     get().connectSocket()
    } catch (error) {
     console.log(error);

  const message =
    error.response?.data?.message ||
    error.message ||
    "Something went wrong";

  toast.error(message);
    }finally {
      set({ isLoggingIn: false})
    }
   } ,

   logout: async()=>{
    try{
      await axiosInstance.post("/auth/logout");
      set({authUser:null})
      toast.success("Logged out successfully")
      get().disconnectSocket()
    }catch(error){
      toast.error("Error logging out");
      console.log("Error logging out:", error)
    }
   },


 updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      console.log("res.data:", res.data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    }
  },
   
connectSocket: () => {  // when we atre login we call this method to connect to the socket server and get the online users
  const {authUser} = get()
  if(!authUser || get().socket?.connected) return
  
  const socket = io(BASE_URL, {withCredentials:true})
  socket.connect()  

  set({socket})

  socket.on("getOnlineUsers", (userIds)=> {
    set({onlineUsers:userIds})
  })

},

disconnectSocket: () => { // when we logout we call this method to disconnect from the socket server 
  if(get().socket?.connected)get().socket.disconnect()
},
})) 