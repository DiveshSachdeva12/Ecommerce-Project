const Product = require('./models/Product');
const { ProductSchema, reviewSchema } = require('./schema');

// Middleware to validate product data
const validateProduct = (req, res, next) => {
   const { name, img, price, desc } = req.body;
   const { error } = ProductSchema.validate({ name, img, price, desc });
   if (error) {
      return res.status(400).render('error', { error: error.details[0].message });
   }
   next();
};

// Middleware to validate review data
const validateReview = (req, res, next) => {
   const { rating, comment } = req.body;
   const { error } = reviewSchema.validate({ rating, comment });
   if (error) {
      return res.status(400).render('error', { error: error.details[0].message });
   }  
   next();
};

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please log in first');
        return res.redirect('/login');  
    }
    next();  
};

const isSeller = (req, res, next)=>{
   if(!req.user.role){
      req.flash('error','You Donot have the permission to do that');
      return res.redirect('/products');  
   }else if(req.user.role !== 'seller') {
      req.flash('error','You Donot have the permission to do that');
      return res.redirect('/products');  
      
   }
   next();
}

const isProductAuthor = async(req, res, next)=>{
   let {id}=req.params; 
  let product= await Product.findById(id)
  if(!product.author.equals(req.user._id)){
   req.flash('error','You are not the authorized user ');
   return res.redirect('/products'); 
  }
  next();
}

module.exports = {isSeller, validateProduct, validateReview, isLoggedIn,isProductAuthor};
