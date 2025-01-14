const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();
const { isLoggedIn}=require('../middleware');



router.get('/',(req,res)=>{
    res.render('auth/signup');
})  
router.get('/register',(req,res)=>{
    res.render('auth/signup');
})  


// to actually registe a user
router.post('/register', async (req, res) => {
    const { username, email, password, confirm_password, role } = req.body;
  
    // Check if passwords match
    if (password !== confirm_password) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/register');
    }
  
    try {
      const user = new User({ username, email, role });
      await User.register(user, password);
      req.flash('success', 'Registration successful. Please log in.');
      res.redirect('/login');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/register');
    }
  });
  


// to get login form 

router.get('/login',(req,res)=>{
    res.render('auth/login');
})

// to actually login via the db
router.post('/login',
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureMessage: true,
    }),
    function(req, res) {
        req.flash('success', `Hello ${req.user.username}`);
        res.redirect('/products'); 
    }           
);


// logout
router.get('/logout', (req, res) => {
    ()=>{
        req.logout();
    }
    req.flash('success','Good Bye , logged out successfully..!!');
    res.redirect(`/login`);
});

router.get('/user/profile', isLoggedIn, (req, res) => {
    res.render('user/profile', { user: req.user });
  });
  
  router.post('/user/profile', isLoggedIn, async (req, res) => {
    const { email, gender, username, phone, address } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user._id, { email, gender, username, phone, address }, { new: true });
  
      req.flash('success', 'Profile updated successfully');
      res.redirect('/user/profile');
    } catch (err) {
      req.flash('error', 'Error updating profile');
      res.redirect('/user/profile');
    }
  });
  
  
module.exports = router;
