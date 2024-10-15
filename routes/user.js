const express = require('express');
const router = express.Router();
const passport = require('passport')
const user = require('../controller/userController')
const authuser = require('../middleware/user');

router.post('/signup', user.Signup)

router.post('/login', user.Login)

router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/success",
        failureRedirect: "/failure",
    })
);
router.get("/success", user.successGoogleLogin);
router.get("/failure", user.failureGooglelogin);

router.post('/otplogin',user.otpLogin)

router.get('/single/:id',user.singlepage)

router.post('/addcart',authuser,user.cartadd)

router.get('/cart',authuser,user.getcart)

module.exports = router 