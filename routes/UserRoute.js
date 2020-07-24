const express = require("express");
const router = express.Router();
const UserData = require("../models/UserData");
const passport = require("passport");


router.get("/",passport.authenticate('jwt',{session : false}),(req,res)=>{
    UserData.findOne({googleId:req.user.googleId}).then((data)=>{
        res.json(data)
    })
})


module.exports = router;
