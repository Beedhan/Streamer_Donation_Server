const mongoose = require("mongoose")
const crypto = require("crypto")

const userDataSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    googleId:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    alertUrl:{
        type:String,
        required:true
    },
    donationUrl:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        default:0
    },
    totalAmount:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model("UserData",userDataSchema);