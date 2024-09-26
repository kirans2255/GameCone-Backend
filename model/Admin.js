const mongoose = require('mongoose')

const admindataSchema = new mongoose.Schema({
    email: String,
    password: String,
})

module.exports = mongoose.model('Admin',admindataSchema)