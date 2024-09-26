const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    isBlocked: { type: Boolean, default: false }
})

module.exports = mongoose.model('User', userschema)