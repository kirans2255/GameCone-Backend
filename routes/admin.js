const express = require('express');
const router = express.Router();
const upload = require('../multer/multer')

const admin = require('../controller/admincontroller')
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


module.exports = router