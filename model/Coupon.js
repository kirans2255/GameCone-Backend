const mongoose = require('mongoose')

const Coupon = new mongoose.Schema({
    Active_Status: {type: String,
        enum: ['active', 'inactive'],
        default: 'Active'
    },
      Coupon_Name : { type: String },
      Coupon_Value: { type: Number },
      Coupon_Type: {
        type: String,
        enum: ['percentage', 'fixedPrice'],
        default: 'percentage'
      },
      Start_Date: { type: String, required: true }, 
      End_Date: { type: String, required: true }
  
})

module.exports = mongoose.model('Coupon',Coupon)