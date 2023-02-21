const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    membership_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"membership"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    start:{
     type:Date,
     default:Date.now()
    },
    end:{
        type:Date,
      default:  function() {
            var thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            return thirtyDaysFromNow;
          }
    }
});
const model = mongoose.model("members", userSchema)

module.exports = model;