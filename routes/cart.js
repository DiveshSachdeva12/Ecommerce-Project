const express = require('express');
const router = express.Router();

const {isLoggedIn}=require('../middleware');
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/user/cart', isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart');
    
    let totalPrice = user.cart.reduce((total, item) => total + item.price, 0);
    const totalItems = user.cart.length; 
    const deliveryCharge = user.cart.length > 0 ? 50 : 0;
    totalPrice += deliveryCharge;
    res.render('cart/cart', { user, totalPrice ,totalItems});
});

router.post('/user/:productId/add',isLoggedIn,async(req,res)=>{
    let {productId} = req.params;
    let userId=req.user._id;
    let product = await Product.findById(productId)
    let user = await User.findById(userId)

    user.cart.push(product);
    await user.save()
    res.redirect('/user/cart');

})

// Remove product from the user's cart
router.post('/user/cart/remove/:productId', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        // Find the user
        const user = await User.findById(userId);
        
        // Check if the user has a cart and the product exists in the cart
        if (!user || !user.cart || user.cart.length === 0) {
            req.flash('error', 'No items in the cart to remove');
            return res.redirect('/user/cart');
        }

        const productIndex = user.cart.indexOf(productId);

        // If the product exists in the cart, remove it
        if (productIndex > -1) {
            user.cart.splice(productIndex, 1);  // Remove the product
            await user.save();
            req.flash('success', 'Product Removed Successfully');
        } else {
            req.flash('error', 'Product not found in the cart');
        }

        // Redirect back to the cart page
        res.redirect('/user/cart');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/user/cart');
    }
});






module.exports = router;
