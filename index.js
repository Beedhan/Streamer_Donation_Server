const express = require("express");
const socketio = require("socket.io");
const axios = require("axios");
const cors = require("cors");
const app = express();

const port = process.env.PORT || "8000";

app.use(express.json());
app.use(cors());

const server = app.listen(port, () => {
  console.log(port);
});

const io = socketio(server);

io.on("connection", (socket) => {
  
  console.log("COnnected");
  socket.on("disconnect", function () {
    console.log("Got disconnect!");
  });
  io.emit("Alert", "Hei")
  socket.on("pong", function (data) {
    console.log(data);
  });
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
      .then((response) => {
        console.log("Alerted");
        if (response.data.state.name === "Completed") {
          io.emit("Alert", msg);
          console.log("Completed");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
