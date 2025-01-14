const express = require("express");
const Product = require("../models/Product"); // Assuming you have a Product model
const router = express.Router();

// Route for search functionality
router.get("/search", async (req, res) => {
    const query = req.query.q ? req.query.q.trim() : '';  // Get search query and trim extra spaces
    const page = parseInt(req.query.page) || 1;  // Default to page 1 if no page specified
    const limit = 10;  // Number of products per page
    const currentUser = req.user || null;  // If you are using Passport.js or another method for user authentication

    if (query) {
        // Normalize the query for case-insensitive search
        const normalizedQuery = query.replace(/\s+/g, '').toLowerCase();

        try {
            // Searching both name and description fields with case-insensitive regex
            const products = await Product.find({
                $or: [
                    { name: { $regex: normalizedQuery, $options: 'i' } },  // Case-insensitive search on name
                    { desc: { $regex: normalizedQuery, $options: 'i' } }   // Case-insensitive search on description
                ]
            })
            .skip((page - 1) * limit) // Skip previous pages
            .limit(limit);  // Limit the results per page

            // Count the total number of matching products
            const totalProducts = await Product.countDocuments({
                $or: [
                    { name: { $regex: normalizedQuery, $options: 'i' } },
                    { desc: { $regex: normalizedQuery, $options: 'i' } }
                ]
            });

            // Calculate total pages for pagination
            const totalPages = Math.ceil(totalProducts / limit);

            // Render search results page with products and pagination info
            res.render("products/searchResults", {
                products,
                currentUser,  // Pass the logged-in user info
                currentPage: page,  // Current page number
                totalPages,  // Total pages available
                query  // Pass query for pagination links
            });
        } catch (error) {
            console.error("Search Error:", error);
            res.status(500).send("Server Error");
        }
    } else {
        // Redirect to the products page if the query is empty
        res.redirect("/products");
    }
});

module.exports = router;
