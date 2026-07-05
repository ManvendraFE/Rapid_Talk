import React, { useState } from "react";
import {useAuthStore} from "../store/useAuthStore"
import BoarderAnimatedContainer from "../components/BorderAnimatedContainer"
import { MessageCircle, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";
function SignUpPage(){
  const  [formData, setFormData] = useState({fullName:"", email:"", password:""}) 
  const {signup, isSigningUp} = useAuthStore()

  const handleSubmit = (e) => {} //
  return <div className="w-full flex items-center justify-center p-4 bg-slate-900">
    <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]"></div>
    <BoarderAnimatedContainer>
      <div className="w-full flex flex-col md:flex-row">
         {/* FORM COL --LEFT SIDE */}
         <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30 ">
         <div className="w-full max-w-md">
          {/* HEADING TEXT */}
          <div className="text-center mb-8">
            <MessageCircleIconc className="w-12 h-12 mx-auto text-slate-400 mb-4"/>
            <h2 className="text-2xl font-bold text-slate-200 mb-2">Create Account</h2>
            <p className="text-slate-400">Sign uyp for a new account</p>

          </div>
          {/*FORM */}
          <form onSubmit={handleSubmit}></form>
         </div>
         </div>

      </div>
     </BoarderAnimatedContainer>
  </div>   
}
export default SignUpPage;