const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
 users:[
    {
        type: Schema.Types.ObjectId,
        ref:"user"
      }
 ],
 latestMessage: {
    type: Schema.Types.ObjectId,
    ref:"Message"
  },
  reciever:{
   name:{
    type:String
   },
   _id:{
    type:String
   },
   email:{
    type:String
   },
   mobile:{
    type:String
   },
   url:{
    type:String
   }
  }
},
{ timestamps: true });

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat