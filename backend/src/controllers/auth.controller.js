import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

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
// login controller: user login karne ke liye, email aur password ke through, aur agar successful login hota hai to token generate karke cookie me set karna hai, taki user authenticated rahe, aur response me user ka data bhejna hai, taki frontend me user ka data show kar sake

export const login = async(req, res)=> {
   const {email, password} = req.body;

   if(!email || !password){
      return res.status(400).json({message: "All fields are required"});
   }

   try{
      const user = await User.findOne({email}) // check if user exists in DB
      if(!user){
         return res.status(400).json({message: "Invalid email or password"});// security purpose: we are not telling user ki email galat hai ya password galat hai, dono ko same message de rahe hai, taki hacker ko pata na chale ki email exist karta hai ya nahi
      }

      if(!email || !password){
         return res.status(400).json({message: "All fields are required"});
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password); // compare the password entered by user with the hashed password stored in DB
      if(!isPasswordCorrect){
         return res.status(400).json({message: "Invalid email or password"});
      }
      generateToken(user._id, res); //ye function token generate karta hai aur cookie me set karta hai, taki user authenticated rahe
      res.status(200).json({
         _id: user._id,
         fullName: user.fullName,
         email: user.email,
         profilePic: user.profilePic,
      })
   } catch (err){
      console.log("Error in login:", err);
      res.status(500).json({message: "Internal server error"});
   }
}

export const logout = (_, res)=>{
   res.cookie("jwt","", {maxAge:0})
   res.status(200).json({message: "Logged Out successful "})
};

export const updateProfile = async(req, res) => {
   try{
      const { profilePic } = req.body;
      if(!profilePic){
         return res.status(400).json({message: "Profile picture is required"});
      }
      const userId = req.user._id; 

     const uploadResponse = await cloudinary.uploader.upload(profilePic)// updating profile picture in cloudinary, profilePic is base64 string sent from frontend, but we also want to upload it to our database 
     const updatedUser = await User.findByIdAndUpdate(userId,
      {profilePic: uploadResponse.secure_url}, 
      {new: true}).select("-password"); // database me user ka profile picture update karna hai, aur new: true ka matlab hai ki updated user object return karna hai
      res.status(200).json(updatedUser)

   }
   catch(error){
     console.log("Error in update profile:", error);
     res.status(500).json({message: "Internal server error"});
   }
}