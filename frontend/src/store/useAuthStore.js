import {create} from 'zustand' ;

export const useAuthStore = create((set, get)=>({
  authUser : {name:"john", _id:123, age:25},
  isLoggedIn:false,
  //isLoggedIn

  login: () => {
    console.log("We just logged in");
    set({isLoggedIn: true});
  },
})) 