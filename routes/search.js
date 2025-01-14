const express = require("express");
const Product = require("../models/Product"); // Assuming you have a Product model
const router = express.Router();

router.get("/search", async (req, res) => {
    const query = req.query.q ? req.query.q.trim() : '';
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 10; // Number of products per page
    const currentUser = req.user || null; // You can replace this with req.user if using Passport.js

    if (query) {
        // Normalize and strip spaces from search query
        const normalizedQuery = query.replace(/\s+/g, '').toLowerCase();

        try {
            // Searching both name and description fields with case-insensitive regex
            const products = await Product.find({
                $or: [
                    { name: { $regex: normalizedQuery, $options: 'i' } }, // Search name
                    { desc: { $regex: normalizedQuery, $options: 'i' } } // Search description
                ]
            })
            .skip((page - 1) * limit) // Skip previous pages
            .limit(limit); // Limit the results to the specified number

            // Count the total number of results
            const totalProducts = await Product.countDocuments({
                $or: [
                    { name: { $regex: normalizedQuery, $options: 'i' } },
                    { desc: { $regex: normalizedQuery, $options: 'i' } }
                ]
            });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalProducts / limit);

            res.render("products/searchResults", {
                products,
                currentUser,  // Passing currentUser to the view for navbar usage
                currentPage: page,
                totalPages,
                query // Pass query to template for pagination
            });
        } catch (error) {
            console.error("Search Error:", error);
            res.status(500).send("Server Error");
        }
    } else {
        res.redirect("/products");
    }
});

module.exports = router;
