const express = require('express');
const router = express.Router();
const upload = require('../multer/multer')

const admin = require('../controller/admincontroller')
const admindata = require('../controller/admindata')
// const authadmin = require('../middleware/admin')

router.post('/admin/login',admin.Login)

router.post('/admin/addCategory',upload.array('CategoryImage'), admin.Category);

router.get('/admin/category',admin.getCategory)

router.delete('/admin/deleteCategory/:id',admin.deleteCategory)

router.put('/admin/editCategory/:id', upload.array('CategoryImage'), admin.editCategory);

router.get('/admin/user',admin.renderUser)

router.post('/admin/toggle',admin.toggleBlock)

router.post('/admin/addProduct',upload.array('images'), admin.addProduct);

router.get('/admin/product',admin.getProduct)

router.delete('/admin/deleteProduct/:id',admin.deleteProduct)

router.put('/admin/editProduct/:id', upload.array('images'), admin.editProduct);

router.get('/admin/coupon',admindata.coupon)

router.post('/admin/addcoupon',admindata.addCoupon)

router.delete('/admin/deleteCoupon/:id',admindata.deleteCoupon)

router.put('/admin/editCoupon/:id',admindata.editCoupon)

router.put('/admin/statusCoupon/:id',admindata.statusCoupon)

//sort

router.get('/admin/product/sort',admindata.sort)

router.get('/admin/products/search',admindata.searchProduct)

router.get('/admin/product/filter',admindata.filterProduct)


module.exports = router