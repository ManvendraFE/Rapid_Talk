import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { // Every single msg has Sender ID
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This is used from User model, Sender User bhi hoga , to usne bhi login kra hoga , then uski Id User Model se ari h 
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;