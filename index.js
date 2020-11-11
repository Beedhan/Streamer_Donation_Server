require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const socketio = require("socket.io");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
//Routes
const alertsRoute = require("./routes/alerts");
const donationRoute = require("./routes/donation");
const logOutRoute = require("./routes/logout");
const googleLogin = require("./routes/loginWithGoogle");
const userRoute = require("./routes/UserRoute");
const passportSetup = require("./passportSetup/passport-setup");
const passport = require("passport");

const port = process.env.PORT || "8000";
const mongoose = require("mongoose");

const UserData = require("./models/UserData");
const { AlertsModel, AlertsHistoryModel } = require("./models/AlertsData");
const moment = require('moment');

//Mongoose Connect
mongoose
  .connect(
    "mongodb+srv://beedhan:1905@donationcluster-z8dvs.mongodb.net/<dbname>?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true,useFindAndModify: false}
  )
  .then(() => {
    console.log("Database successfully connected");
  });

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://your-production-website.com"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Here is home page");
});
//Routes
app.use("/auth", googleLogin);
app.use("/alerts", alertsRoute);
app.use("/donation", donationRoute);
app.use("/user", userRoute);

const server = app.listen(port, "0.0.0.0", () => {
  console.log(port);
});
const io = socketio(server);

//Socketio logics

io.on("connect", (socket) => {
 
  socket.on("room", (roomCode) => {
    console.log(roomCode,"Id");
    socket.join(roomCode);
    io.to(roomCode).emit("check", `Hello ${roomCode}`);

    socket.on("testing",()=>{
      console.log("Testing Connected");
      io.to(roomCode).emit("Alert", {
              donatorName:"Test",
              donationAmount:69,
             donationMessage:"This is a test",
      });
    })
    socket.on("Donated", (msg) => {
      console.log(msg);
      let data = {
        token: msg.token,
        amount: msg.amount,
      };
      let config = {
        headers: {
          Authorization:
            process.env.KhaltiSecret ||
            `Key test_secret_key_0a6b63fb056641b9b78fae20fe65d46d`,
        },
      };
      axios
        .post("https://khalti.com/api/v2/payment/verify/", data, config)
        .then(async (response) => {
          if (response.data.state.name === "Completed") {
            //Saving donation in history
            const user = await UserData.findOneAndUpdate({ token: roomCode },{$inc:{amount:msg.donationAmount,totalAmount:msg.donationAmount}});
            //^ updating user earned amounts
            console.log(moment().format());
            new AlertsHistoryModel({
              googleId: user.googleId,
              donatorName: msg.donatorName,
              donationAmount: msg.donationAmount,
              donationMessage: msg.donationMessage,
            })
              .save()
              .then(() => {
                io.to(roomCode).emit("Alert", msg);
                io.to(msg.donationPageId).emit("thanksForDonation", "true,Thanks yrr");
                console.log("Completed");
              });
          }
        })
        .catch((error) => {
          console.log(error, "ERR");
        });
    });

  
    socket.on("disconnect", () => {
      console.log("Disconnected from " + roomCode);
    });
  });
});
