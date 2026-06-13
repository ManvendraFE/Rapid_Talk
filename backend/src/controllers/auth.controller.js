import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

import { ENV } from "../lib/env.js";

export const signup =  async (req, res)=>{
 const {fullName, email, password} = req.body

 try{
    if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters long"});
    }
    // check if emails valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if(!emailRegex.test(email)) {
      return res.status(400).json({message: "Invalid email format"})};

     // check if user already exists in DB 

     const existingUser = await User.findOne({email});
     if(existingUser){
        return res.status(400).json({message: "User with this email already exists"});
     }

     //password hashing: bcrypt 123456 => $gbcbsg5w8twv2eh6169*
     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password, salt);

     // create new user in DB

     const newUser = new User({
        fullName ,
        email,
        password: hashedPassword,
     })

     if(newUser){
      //   generateToken(newUser._id, res)
      //   await newUser.save();
      // Persist the user to the database and generate a token
        const savedUser = await newUser.save();
        generateToken(savedUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        })
           // todo: send a welcome email to user 
           try{
            // Code to send welcome email
            await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
           } catch(error){
            console.error("Error sending welcome email:", error);
           }
     } else{
        res.status(400).json({message: "Invalid user data"})
     }
 } catch(err){
    console.log("Error in signup:", err);
    return res.status(500).json({message: "Internal server error"});  
 }
}