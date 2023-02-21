const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
     type:String
    },
    mobile:{
        type:String
    },
    url:{
        type:String

    },
    public_id:{
        type:String
    },
    role:{
        type:String,
        default:"user"
    },
    membership_id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"members"
    } ,
    balance:{
        type:Number,
        default:0
    },
    description:{
        type:String
    },
    address:{
        type:String
    },
    timings:{
        type:String
    },
    mapiframe:{
        type:String
    },
    rank:{
        type:Number,
        default:0
    },
    clicks:{
        type:Number,
        default:0
    },
    category:{
      type:String
    }
});
userSchema.statics.updateRanks = async function() {
    const users = await this.find().sort({ clicks: 'desc' });
    for (let i = 0; i < users.length; i++) {
      users[i].rank = i + 1;
      await users[i].save();
    }
  }
  userSchema.methods.incrementClicks = async function() {
    await this.constructor.updateRanks();
  }
  
const model = mongoose.model("user", userSchema)

module.exports = model;