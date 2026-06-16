import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async ()=>{
  try{
    const {MONGO_URL} = ENV;
    if(!MONGO_URL){
        throw new Error("MONGO_URL is not defined in environment variables");
    }
    await mongoose.connect(ENV.MONGO_URL)
    console.log("MONGODB CONNECTED:" , mongoose.connection.host);

    //const user = await User.findOne()
  }
  catch(err){
    console.error("Error connection to MongoDB:", err)
    process.exit(1); // 1 status code means fail, 0 means success
  }
}