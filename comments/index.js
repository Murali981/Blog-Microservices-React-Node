const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto"); // We are using it to generate randomId's

const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || []; // This will give us either an array (or) undefined, It will give undefined if we
  // have never had a comment as created that is associated with this post, So it will create an empty array if it is undefined
  console.log(comments);
  comments.push({ id: commentId, content });
  console.log(comments);

  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
