const mongoose = require('mongoose')
const moment = require('moment');

const AlertSchema = mongoose.Schema({
    googleId:{
        type:String,
        required:true
    },
    AlertsDuration:{
        type:Number,
        default:5
    },
    AnimationIn:{
        type:String,
        default:"backInRight"
    },
    AnimationOut:{
        type:String,
        default:"backOutRight"
    },
    SelectedImage:{
        type:Number,
        default:0
    },
    SelectedAudio:{
        type:Number,
        default:0
    }
})
const AlertHistorySchema = mongoose.Schema({
    googleId:{
        type:String,
        required:true
    },
   donatorName:{
       type:String,
       required:true
   },
   donationAmount:{
       type:String,
       required:true
   },
   donationMessage:{
    type:String,
    required:true
   },
   date:{
       type:Date,
       default:moment().utc().format()
   }
})

const AlertsModel = mongoose.model("AlertsData",AlertSchema);
const AlertsHistoryModel = mongoose.model("AlertHistoryData",AlertHistorySchema);

module.exports = {AlertsModel,AlertsHistoryModel}