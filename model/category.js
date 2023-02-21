const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    public_id:{
        type: String,
        required: true
    },
});
const model = mongoose.model("category", userSchema)

module.exports = model;