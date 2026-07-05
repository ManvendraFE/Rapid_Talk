import {create} from 'zustand' ;
import {axiosInstance} from "../lib/axios.js"
import toast from "react-hot-toast";
export const useAuthStore = create((set)=>({
   authUser: null, // if user is authenticated we can set user object here
   isCheckingAuth: true,
   isSigningUp: false,

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
   } 
})) 