const express = require('express');
const router = express.Router();
const asyncerror = require('../middlewares/catchasyncerror.js');
const ErrorHandler = require('../middlewares/errorhandler');
const User=require('../model/user.js')
const Message=require('../model/messages.js')
const Chat=require('../model/chat.js')
const sendmsg=require('../middlewares/sendmsg.js')
const {verifyToken,isadmin}=require('../middlewares/verifyauth.js')
const Apifeature = require('../utilis/apifeature.js');
 const otpGenerator=require('otp-generator')
 const cloudinary=require('cloudinary')
const jwt=require('jsonwebtoken')

router.post('/allmsgs',verifyToken,asyncerror(async (req, res,next) => {
    try {
      function getUserWithDifferentId(users, givenId) {
        if (users[0].toString() === givenId.toString()) {
          return users[1];
        } else  {
          return users[0];
        }
      }
      const messages = await Message.find({ chat: req.body.chatId })
        .populate("sender", "name url email")
        .populate("chat");
       for (const obj of messages) {
        let oldreciever=getUserWithDifferentId(obj.chat.users,req._id)
        let reciever=await User.findById(oldreciever).select("name email _id url mobile")
         obj.reciever=reciever;
       }
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }))

 router.post('/sendmsg',verifyToken,asyncerror(async (req, res,next) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: req._id,
      content: content,
      chat: chatId,
    };
  
    try {
      var message = await Message.create(newMessage);
  
      message = await message.populate("sender", "name url");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name url email",
      });
  
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message._id });
  
      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }))
  

module.exports=router