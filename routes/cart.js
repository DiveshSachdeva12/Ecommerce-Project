const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middleware');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

router.delete('/reviews/:id', isLoggedIn, async (req, res) => {
    try {
        const reviewId = req.params.id;

        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            req.flash('error', 'Review not found');
            return res.redirect('/products');
        }

        const product = await Product.findById(deletedReview.productId);  // Find the associated product
        if (product) {
            req.flash('success', 'Review deleted successfully');
            return res.redirect(`/products/${product._id}`);
        }
        req.flash('success', 'Review deleted successfully');
        res.redirect('/products/6784de2d9401ed288d8263d4');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('cart/cart');
    }
});

router.get('/user/cart', isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart');
    
    let totalPrice = user.cart.reduce((total, item) => total + item.price, 0);
    const totalItems = user.cart.length;
    const deliveryCharge = user.cart.length > 0 ? 50 : 0;
    totalPrice += deliveryCharge;

    res.render('cart/cart', { user, totalPrice, totalItems });
});

router.post('/user/:productId/add', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        let product = await Product.findById(productId);
        let user = await User.findById(userId);

        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/products');
        }

        user.cart.push(product);
        await user.save();
        req.flash('success', 'Product added to cart');
        res.redirect('/user/cart');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/user/cart');
    }
});

// Remove product from the user's cart
router.post('/user/cart/remove/:productId', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);

        if (!user || !user.cart || user.cart.length === 0) {
            req.flash('error', 'No items in the cart to remove');
            return res.redirect('/user/cart');
        }

        const productIndex = user.cart.indexOf(productId);

        if (productIndex > -1) {
            user.cart.splice(productIndex, 1);  
            await user.save();
            req.flash('success', 'Product removed from cart');
        } else {
            req.flash('error', 'Product not found in the cart');
        }

        res.redirect('/user/cart');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/user/cart');
    }
});

module.exports = router;
