const express = require("express");
require('dotenv').config()

module.exports.isAuthorized = (req,res,next)=>{
    if(req.headers.authorization===process.env.SERVER_AUTH){
        next();
    }else{
       return res.json({msg:"Not authorized"});
    }
}