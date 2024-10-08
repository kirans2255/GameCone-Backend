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
            Coupon_Value: Coupon_Value,
            Coupon_Type: Coupon_Type,
            Start_Date: Start_Date,
            End_Date: End_Date,
            Active_Status: Active_Status,
        });

        await newCoupon.save();

        res.status(201).json({ success: true, coupon: newCoupon });
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

const editCoupon = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const couponId = req.params.id;

        console.log("id:", couponId);

        const { Coupon_Name, Coupon_Value, Coupon_Type, Start_Date, End_Date, Active_Status } = req.body;

        console.log("name:", Coupon_Name);

        if (!Coupon_Name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // Find the coupon by ID
        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            return res.status(404).json({ error: 'coupon not found' });
        }


        coupon.Coupon_Name = Coupon_Name,
            coupon.Coupon_Value = Coupon_Value,
            coupon.Coupon_Type = Coupon_Type,
            coupon.Start_Date = Start_Date,
            coupon.End_Date = End_Date,
            coupon.Active_Status = Active_Status,


            await coupon.save();
        res.json({ message: 'coupon updated successfully' });
    } catch (error) {
        console.error('Error updating coupon:', error);
        res.status(500).json({ error: 'Error updating coupon' });
    }
}

const statusCoupon = async (req, res) => {
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        console.log("update", updatedCoupon);

        res.status(200).json({ success: true, coupon: updatedCoupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


const sort = async (req, res) => {
    const { sortOrder } = req.query;
    let sort;

    console.log("lo",req.query);

    switch (sortOrder) {
        case 'priceLowToHigh':
            sort = { price: 1 };
            break;
        case 'priceHighToLow':
            sort = { price: -1 };
            break;
        case 'nameAtoZ':
            sort = { name: 1 };
            break;
        case 'nameZtoA':
            sort = { name: -1 };
            break;
        default:
            sort = {}; // No sorting
    }

    try {
        const products = await Product.find().sort(sort);
        res.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const searchProduct = async (req, res) => {
    const { search } = req.query;

    // console.log("search",req.query);

    try {
        // If there's a search term, search for products and categories by name
        const categoryQuery = search
            ? { CategoryName: { $regex: search, $options: 'i' } }
            : {}; // No search term means no filter

            console.log("c",categoryQuery);
            

        const productQuery = search
            ? { name: { $regex: search, $options: 'i' } }
            : {};

            console.log("d",productQuery);
            

        const categories = await Categorys.find(categoryQuery);
        const products = await Product.find(productQuery);

        res.json({ categories, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = {
    coupon,
    addCoupon,
    deleteCoupon,
    editCoupon,
    sort,
    statusCoupon,
    searchProduct
}
