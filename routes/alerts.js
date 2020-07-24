const express = require("express");
const router = express.Router();
const UserData = require("../models/UserData");
const auth = require("../components/authorization")
const {AlertsModel,AlertsHistoryModel} = require("../models/AlertsData");
const passport = require("passport");


router.get('/getAlertData',auth.isAuthorized,async(req,res) =>{
    //for alert widget page
   const user=await UserData.findOne({token:req.query.token})
   const alertData = await AlertsModel.findOne({googleId:user.googleId});
   res.send(alertData)
})

router.put('/alertSave',passport.authenticate('jwt',{session : false}),async(req,res)=>{
    AlertsModel.replaceOne({googleId:req.user.googleId},req.body.alertData).then(data=>{
        res.json({msg:"Saved"})
    })
})

router.get('/alertData',passport.authenticate('jwt',{session : false}),async(req,res)=>{
    AlertsModel.findOne({googleId:req.user.googleId}).then(alertData=>{
        res.send(alertData);
    })
})
router.get('/alertHistory',passport.authenticate('jwt',{session : false}),async(req,res)=>{
    AlertsHistoryModel.find({googleId:req.user.googleId}).sort({date:-1}).then(alertHistory=>{
        res.send(alertHistory);
    })
})

module.exports =router;

