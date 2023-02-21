const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price:{
        type: Number,
    },
    feature:{
        type: String,

    },
    button:{
        type:String,
        default:"Buy Now"
    }
});
const model = mongoose.model("membership", userSchema)

module.exports = model;