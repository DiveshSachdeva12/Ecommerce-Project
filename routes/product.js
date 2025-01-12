const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const {validateProduct ,isLoggedIn,isSeller,isProductAuthor}=require('../middleware');
const router = express.Router()


// to show all the products
router.get('/products',isLoggedIn, async(req,res)=>{
   try{
      let products = await Product.find({});
      res.render('products/index',{products});
   }
   catch(e){
      res.status(500).render('error',{err:e.message});
   }
})
// to show the form for new products
router.get('/products/new',isLoggedIn,(req,res)=>{
   try{
      res.render('products/new')
   }
   catch(e){
      res.status(500).render('error',{err:e.message});

   }
})


// to actually add the product
router.post('/products',isLoggedIn,isSeller,async (req,res)=>{
   try{
      let{name,img,price,desc}= req.body;
      await Product.create({name,img,price,desc,author:req.user._id})
      req.flash('success','ProducT Added Successfully');
      res.redirect('/products');
   }
   catch(e){
      res.status(500).render('error',{err:e.message});
   }
})
// to show particular project
router.get('/products/:id', isLoggedIn,async (req,res)=>{
   try{
      let{id}= req.params;
      let foundProduct=await Product.findById(id).populate('reviews');
      res.render('products/show',{foundProduct, msg:req.flash('msg')});
   }
   catch(e){
      res.status(500).render('error',{err:e.message});
   }
})
// form to edit the products
router.get('/products/:id/edit', isLoggedIn,async(req,res)=>{
   try{
      let {id}= req.params;
      let foundProduct= await Product.findById(id);
     res.render('products/edit',{foundProduct});
   } 
   catch(e){
      res.status(500).render('error',{err:e.message});

   }

})

// to actually edit the data in DB
router.patch('/products/:id', isLoggedIn,validateProduct ,async(req,res)=>{
   try{
      let {id}= req.params;
      let {name,img,price,desc}= req.body
      await Product.findByIdAndUpdate(id,{name,img,price,desc});
      req.flash('success','ProducT Edited Successfully');
      res.redirect(`/products/${id}`);
   }
   catch(e){
      res.status(500).render('error',{err:e.message});
   }

})

// to delete a product
router.delete('/products/:id',isProductAuthor,isLoggedIn,async(req,res)=>{
   try{
      let {id}= req.params;
      const product = await Product.findById(id);
     //  for(let id of product.reviews){
     //    await Review.findByIdAndDelete(id)
     //  }
      await Product.findByIdAndDelete(id);
      req.flash('success','ProducT Deleted Successfully');
      res.redirect(`/products`);
   }
   catch(e){
      res.status(500).render('error',{err:e.message});

   }
 })
 
module.exports= router;