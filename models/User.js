const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    googleId:{
        type:String,
        required:true
    },
    token:{
        type:String,
        default:Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    },
    created:{
        type:Date,
        default:Date.now
    }
})

userSchema.methods.comparePasswords = function(password,callBack){
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err){
            return callBack(err)
        }else{
            if(!isMatch){
                return callBack(null,isMatch);
            }
            return callBack(null,this);
        }
    })
}

module.exports = mongoose.model("User",userSchema);