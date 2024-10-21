const mongoose = require('mongoose')

const wishlist = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        images: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true,
            }
        },
    }]
})

module.exports = mongoose.model('Wishlist', wishlist)