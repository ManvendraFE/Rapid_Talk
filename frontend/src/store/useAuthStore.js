import {create} from 'zustand' ;
import {axiosInstance} from "../lib/axios.js"
import toast from "react-hot-toast";
export const useAuthStore = create((set)=>({
   authUser: null, // if user is authenticated we can set user object here
   isCheckingAuth: true,
   isSigningUp: false,
   isLoggingIn: false,

   checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({authUser: res.data})
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
    } catch (error) {
      toast.error(error.response.data.message)// we can access to the error in Axios
    }finally {
      set({ isLoggingIn: false})
    }
   } ,

   logout: async()=>{
    try{
      await axiosInstance.post("/auth/logout");
      set({authUser:null})
      toast.success("Logged out successfully")
       
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
   
   
})) 