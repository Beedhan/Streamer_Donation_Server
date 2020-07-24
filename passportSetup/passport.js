const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const User = require("../models/User")


const cookieExtractor = req =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies["access_token"];
    }
    return token;
}


//authorization using cookie
// passport.use(new JwtStrategy({
//     jwtFromRequest:cookieExtractor,
//     secretOrKey:"9AA292BA2AFE3F619724F3EF44AA7"
// },(payload,done)=>{

//     User.findOne({username:payload.sub},(err,user)=>{
//         if(err)
//             return done(err,false);
        
//         if(user)
//             return done(null,user);
//         else
//             return done(null,false);
        
//     })
// }));
passport.use(new JwtStrategy({
    jwtFromRequest : cookieExtractor,
    secretOrKey : "NoobCoder"
},(payload,done)=>{
    console.log("Here")
    User.findById({_id : payload.sub},(err,user)=>{
        if(err)
            return done(err,false);
        if(user)
            return done(null,user);
        else
            return done(null,false);
    });
}));

//authentication for local strategy using username and password
passport.use(new LocalStrategy((username,password,done)=>{
    User.findOne({username},(err,user)=>{
        //check if error with db
        if(err){
            return done(err);
        }
        //if user does not exists
        if(!user){
            return done(null,false);
        }
        //check if password is correct\
        user.comparePasswords(password,done);
    })
}))