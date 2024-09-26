const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  edition: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required : true,
  },
  images: { 
    public_id:{
    type: String,
    required: true
    },
      url:{ 
        type:String,
        required:true,
      }
    },
//   category: {
//     type: String,
//     required: true,
//   },
//   stock: {
//     type: Number,
//     default: 0,
//   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
