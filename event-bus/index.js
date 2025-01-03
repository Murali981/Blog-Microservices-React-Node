const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.body; // Whatever comes into the request body which is going to be our event, The event can be a JSON object,
  // It can be a string, It can be an array, It can be an object, It can be anything.

  axios.post("http://localhost:4000/events", event); // on 4000 port our posts service is running
  axios.post("http://localhost:4001/events", event); // on 4001 port our comments service is running
  axios.post("http://localhost:4002/events", event); // on 4002 port our query service is running
  axios.post("http://localhost:4003/events", event); // on 4003 port our moderation service is running

  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
