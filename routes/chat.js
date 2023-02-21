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


 router.post('/accesschat',verifyToken,asyncerror(async (req, res,next) => {
  
        const { userId } = req.body;
      
        if (!userId) {
          console.log("UserId param not sent with request");
          return res.sendStatus(400);
        }
      
        var isChat = await Chat.find({
          $and: [
            { users: { $elemMatch: { $eq: req._id } } },
            { users: { $elemMatch: { $eq: userId } } },
          ],
        })
          .populate("users")
          .populate("latestMessage");
      
        isChat = await User.populate(isChat, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
      
        if (isChat.length > 0) {
          res.send(isChat[0]);
        } else {
          var chatData = {
            users: [req._id, userId],
          };
      
          try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
              "users"
            );
            res.status(200).json(FullChat);
          } catch (error) {
            res.status(400);
            throw new Error(error.message);
          }
        }
    
  }))
  router.get('/allchats',verifyToken,asyncerror(async (req, res) => {
    function getUserWithDifferentId(users, givenId) {
      if (users[0]?._id.toString() === givenId.toString()) {
        return users[1];
      } else  {
        return users[0];
      }
    }
      Chat.find({ users: { $elemMatch: { $eq: req._id } } })
        .populate("users","name email mobile url")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name url email",
          });
           results.map(obj => {
            const reciever=getUserWithDifferentId(obj.users,req._id)
            obj.reciever=reciever;
          });
          res.status(200).send(results);
        });
  }))

module.exports=router