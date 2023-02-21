const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email:{
     type:String
    },
    mobile:{
     type:String
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:String
    }
});
const model = mongoose.model("employee", userSchema)

module.exports = model;