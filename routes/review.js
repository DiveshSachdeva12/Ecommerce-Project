const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validateReview } = require('../middleware');
const router = express.Router();

// Route to add a review to a product
router.post('/products/:id/review', validateReview, async (req, res) => {
   try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      const product = await Product.findById(id);
      if (!product) {
         return res.status(404).render('error', { error: 'Product not found' });
      }

      const review = new Review({ rating, comment });
      product.reviews.push(review);

      await review.save();
      await product.save();
      req.flash('success','Review added successfully')
      res.redirect(`/products/${id}`);
   }  catch (e) {
      res.status(500).render('error', { error: e.message });
   }
});

module.exports = router;
