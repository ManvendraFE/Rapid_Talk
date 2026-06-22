import jwt from 'jsonwebtoken';
import User from "../models/User.js"
import { ENV } from '../lib/env.js';


export const protectedRoute = async (req, res, next) => {
  try{
    const token = req.cookies.jwt; // req object se token extract karna hai, assuming token is stored in cookies with name 'jwt '
    if(!token){
      return res.status(401).json({message: "Unauthorized - no token provided"}); 
    }
    const decoded = jwt.verify(token,ENV.JWT_SECRET)// token verify karna hai, agar token valid hai to decoded payload milega, jisme user id hogi
    if(!decoded){
      return res.status(401).json({message: "Unauthorized - invalid token"}); // token h but invalid h 
    }
    const user = await User.findById(decoded.userId).select("-password") // decoded payload se user id extract karna hai, fir DB se user find karna hai
    if(!user){
      return res.status(401).json({message: "Unauthorized - user not found"}); // user not found in DB
    }
    req.user=user; // agar sab kuch thik hai to req object me user attach karna hai, taki next middleware ya controller function me access ho sake
    next(); // agar sab kuch thik hai to next middleware ya controller function call karna hai
  }
  catch(error){
    console.log("Error in protectedRoute middleware:", error);
    return res.status(500).json({message: "Internal server error"}); // agar koi error aata hai to 500 error return karna hai
  }
}