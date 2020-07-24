const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
require("dotenv").config();
const User = require("../models/User");
const UserData = require("../models/UserData");
const {AlertsModel} = require("../models/AlertsData");
const { setUser } = require("../routes/UserRoute");
const jwt = require("jsonwebtoken");

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id).then((user) => {
//     done(null, user);
//   });
// });
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: "ThisIsSecret",
    },
    (payload, done) => {
      return User.findOne({ googleId: payload.id }).then((user) => {
        // console.log(user)
        if (user) {
          done(null, user);
        }else{
          done(null, false)
        }
      });
    }
  )
);

// after clicking login with google it takes data from this strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user already Exists
      User.findOne({ googleId: profile.id }).then((user) => {
        if (user) {
          //already have the user
          const token = jwt.sign({ id: user.googleId }, "ThisIsSecret");
          done(null, token);
        } else {
          //create new user
          new User({
            username: profile.displayName.replace(/\s+/g, ""),
            email: profile.emails[0].value,
            googleId: profile.id,
          })
            .save()
            .then((newUser) => {
              //Create user data like donation url and alert page url here
              new UserData({
                username: newUser.username,
                token: newUser.token,
                googleId: newUser.googleId,
                alertUrl: `${process.env.WEBSITE_URL}/widgets/alerts?token=${newUser.token}`,
                donationUrl: `${process.env.WEBSITE_URL}/donate/${newUser.username}`,
                profilePic:profile.photos[0].value

              })
                .save()
                .then((user) => {
                  new AlertsModel({googleId:user.googleId}).save()
                  const token = jwt.sign({ id: user.googleId }, "ThisIsSecret");
                  done(null, token);
                });
            });
        }
      });
    }
  )
);
