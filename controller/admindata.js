const Admin = require('../model/Admin');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary')
const Categorys = require('../model/Category')
const User = require('../model/User')
const Product = require('../model/Product')
const Coupon = require('../model/Coupon')

const coupon = async (req, res) => {
    try {
        const coupons = await Coupon.find()
        // console.log("re:",coupons);
        res.json({ coupons })
    } catch (error) {
        console.error('Error Fetching Coupon', error)
        res.status(500).json({ error: 'Error fetching Coupon' })
    }
}

const addCoupon = async (req, res) => {
    // console.log("req:",req.body);

    const { Coupon_Name, Coupon_Value, Coupon_Type, Start_Date, End_Date, Active_Status } = req.body;

    try {
        const newCoupon = new Coupon({
            Coupon_Name: Coupon_Name,
            Coupon_Value:Coupon_Value,
            Coupon_Type:Coupon_Type,
            Start_Date: Start_Date,
            End_Date: End_Date,
            Active_Status: Active_Status,
        });

         await newCoupon.save();

        res.status(201).json({ success: true, coupon: newCoupon});
    } catch (error) {
        console.error('Error adding coupon:', error);
        res.status(500).json({ success: false, message: 'Failed to add coupon' });
    }
}

const deleteCoupon = async (req, res) => {

    const couponID = req.params.id;
    console.log(couponID);
  
    try {
      const coupons = await Coupon.findByIdAndDelete(couponID);
      if (!coupons) {
        return res.status(404).json({ error: 'coupon Not Found' })
      }
  
      res.status(201).json({ message: 'coupont Deleted', coupons })
    } catch (error) {
      console.error('Error deleting coupon:', error);
      res.status(500).json({ error: 'Error deleting coupon' });
    }
  }

module.exports = {
    coupon,
    addCoupon,
    deleteCoupon
}
