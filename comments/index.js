const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto"); // We are using it to generate randomId's

const cors = require("cors");

const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || []; // This will give us either an array (or) undefined, It will give undefined if we
  // have never had a comment as created that is associated with this post, So it will create an empty array if it is undefined

  comments.push({ id: commentId, content }); // After pushing it into the comments array

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("Received the event", req.body.type); // We are printing the type of the event that we have got

  res.send({});
}); // This end point is going to receive any event that is coming from the event bus

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
