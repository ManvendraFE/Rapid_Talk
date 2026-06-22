import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import router from "../routes/message.route.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: {$ne: loggedInUserId}
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({message: "Server error"});
  }
}

export const getMessagesByUserId = async(req, res) => {
  try { 
    const myId = req.user._id;
    const {id: userToChatId} = req.params;

    // ✅ fixed: message → messages
    const messages = await Message.find({
      $or: [
        {senderId: myId, receiverId: userToChatId},
        {senderId: userToChatId, receiverId: myId},
      ],
    });

    // ✅ fixed: messages not message
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message)
    res.status(500).json({error: "Internal server error"});
  }
}

export const sendMessage = async (req, res) => {
  try {
    const {text, image} = req.body;
    const {id: receiverId} = req.params; // ✅ fixed: recieverId → receiverId
    const senderId = req.user._id; // ✅ fixed: _Id → _id

      if(!text && !image){
        return res.status(400).json({message: "Text or image is required."});
      }
      if(senderId.equals(receiverId)){
        return res.status(400).json({message: "Cannot send message to yourself."})
      }
      const recieverExists = await User.exists({_id: receiverId});
      if(!recieverExists){
        return res.status(404).json({message: "Receiver not found. "});
      }

    let imageUrl;
    if(image){
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId, // ✅ fixed: recieverId → receiverId
      text,
      image: imageUrl
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message)
    res.status(500).json({error: "Internal server error"});
  }
}

export const getChatPartners = async (req, res) => { // here we fetch only chats we have..., if we have 100 user in contact , but we chat with only 2 then 2 user will fetch here.--> Find in messages where reciever or sender is us
  try {
    const loggedInUserId = req.user._id;

    // find all messages where the logged-in userr is either sender or reciever 
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId}, {receiverId: loggedInUserId}],
    }); // till here msg is found

    const chatPartnerIds =[
      ... new Set (
        messages.map((msg)=> msg.senderId.toString() === loggedInUserId.toString() 
    ? msg.receiverId.toString() 
    : msg.senderId.toString()
    )
   ),
   ]// Extracting chatpartner ID, I conerted these into set to remove duplicate
   const chatPartners = await User.find({_id: {$in:chatPartnerIds}}).select("-password")

   res.status(200).json(chatPartners)
  } catch (error) {
    console.error("Errro in getChatPartners: ", error.message);
    res.status(500).json({error: "Internal server error"});
  }
}

