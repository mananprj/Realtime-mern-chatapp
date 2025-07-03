import cloudinary from "../lib/cloudinary.js";
import { getReceiverSockrtId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSideBar = async (req, res) => {
    try {
        const LoggedInUserId = req.user._id;
        const filteredUser = await User.find({_id: {$ne: LoggedInUserId}}).select("-password");

        res.status(200).json(filteredUser);
    } catch (error) {
        console.error("Error in getUserForSideBar: " + error.message);
        res.status(500).json({message: "Internal server error"});
    }   
}

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ],
        });

        res.status(200).json(message);

    } catch (error) {
        console.error("Error in getMessage: " + error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageurl;
        if(image){
            const uploadresponse = await cloudinary.uploader.upload(image);
            imageurl = uploadresponse.secure_url;
        }

        const newmessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageurl,
        })

        await newmessage.save();

        const receiverSocketId = getReceiverSockrtId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newmessage", newmessage);
        }

        res.status(201).json(newmessage);

    } catch (error) {
        console.error("Error in sendMessage: " + error.message);
        res.status(500).json({message: "Internal server error"});
    }
}