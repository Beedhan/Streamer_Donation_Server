const express = require("express");
const router = express.Router();
const UserData = require("../models/UserData");
const auth = require("../components/authorization")


router.get('/:userId',auth.isAuthorized,async(req,res) =>{
    console.log(req.params.userId)
    const user =await UserData.findOne({username:req.params.userId})
    res.json({roomId:user.token})
})


module.exports =router;

