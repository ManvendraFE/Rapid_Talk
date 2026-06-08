import mongoose from "mongoose";

export const connectDB = async ()=>{
  try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("MONGODB CONNECTED:" , mongoose.connection.host);

    //const user = await User.findOne()
  }
  catch(err){
    console.error("Error connection to MongoDB:", err)
    process.exit(1); // 1 status code means fail, 0 means success
  }
}