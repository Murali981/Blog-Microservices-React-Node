const express = require("express");

const bodyParser = require("body-parser");

const { randomBytes } = require("crypto");

const cors = require("cors");

const axios = require("axios");

const app = express();

app.use(bodyParser.json());

app.use(cors());

const posts = {}; // This posts object is going to store every object that we create

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex"); // This will give a nice random looking ID
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  }; // Here we are adding a new post to our post collection.

  // await axios.post("http://localhost:4005/events", {
  //   // This is an asynchronous operation making the network request
  //   type: "PostCreated",
  //   data: {
  //     id,
  //     title,
  //   },
  // }); // In the port 4005 only our event-bus service is running

  await axios.post("http://event-bus-srv:4005/events", {
    // This is an asynchronous operation making the network request, This event-bus-srv is the name of the event-bus service inside the
    // kubernetes cluster
    type: "PostCreated",
    data: {
      id,
      title,
    },
  }); // In the port 4005 only our event-bus service is running

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received the event", req.body.type); // We are printing the type of the event that we have got

  res.send({});
}); // This end point is going to receive any event that is coming from the event bus

app.listen(4000, () => {
  console.log("version 1000"); // Added this line to update the deployement of kubernetes cluster
  console.log("Listening on port 4000");
});
