const express = require("express");
const Product = require("../models/Product"); 
const router = express.Router();

// Route for search functionality
router.get("/search", async (req, res) => {
    const query = req.query.q ? req.query.q.trim() : '';  
    const page = parseInt(req.query.page) || 1; 
    const limit = 10;  
    const currentUser = req.user || null; 

    if (query) {
        const normalizedQuery = query.replace(/\s+/g, '').toLowerCase();

        try {
            const products = await Product.find({
                $or: [
                    { name: { $regex: normalizedQuery, $options: 'i' } }, 
                    { desc: { $regex: normalizedQuery, $options: 'i' } }  
                ]
            })
            .skip((page - 1) * limit) 
            .limit(limit);  

            const totalProducts = await Product.countDocuments({
                $or: [
                    { name: { $regex: normalizedQuery, $options: 'i' } },
                    { desc: { $regex: normalizedQuery, $options: 'i' } }
                ]
            });

            const totalPages = Math.ceil(totalProducts / limit);

            res.render("products/searchResults", {
                products,
                currentUser,  
                currentPage: page,  
                totalPages,  
                query  
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
