const mongoose = require("mongoose");
const Review = require('./Review'); // Import the Review model

const producSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    img: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    desc: {
        type: String,
        trim: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Middleware to delete reviews when a product is deleted
producSchema.post('findOneAndDelete', async (product) => {
    if (product.reviews.length > 0) {
        try {
            await Review.deleteMany({ _id: { $in: product.reviews } }); // Delete all reviews associated with the product
        } catch (err) {
            console.error('Error deleting reviews:', err);
        }
    }
});

let Product = mongoose.model('Product', producSchema);
module.exports = Product;
