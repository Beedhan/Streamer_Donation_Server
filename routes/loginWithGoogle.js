const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const JWT = require("jsonwebtoken");

let user ={}


//when user clicks login with google this route triggers and redirect to google login page
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile","email",
    ,"https://www.googleapis.com/auth/youtube.readonly"],
  })
);


//after logging redirects here and takes token and exchange with user data and calls callback in strategy
//callback route for google to redirect to
router.get("/google/redirect",passport.authenticate('google',{ session: false } ), (req, res) => {

  if(req.isAuthenticated()){
    // res.redirect(`${process.env.WEBSITE_URL}/loginSuccess?token=${req.user}`)
    res.cookie("access_token",req.user,{ maxAge: 86400000, httpOnly: true });
    res.redirect(`${process.env.WEBSITE_URL}/dashboard`);
  }
});


router.get("/user",passport.authenticate('jwt',{session : false}),(req,res)=>{
  res.json({user:req.user,isAuthenticated:true})
})


module.exports = router;
