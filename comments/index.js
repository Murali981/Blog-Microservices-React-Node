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
  const commentId = randomBytes(4).toString("hex"); // We are generating a random ID for every comment
  const { content } = req.body; // We are getting the content of the comment

  const comments = commentsByPostId[req.params.id] || []; // This will give us either an array (or) undefined, It will give undefined if we
  // have never had a comment as created that is associated with this post, So it will create an empty array if it is undefined
  // In the above line of code we are getting the list of comments that already exist that is associated with the given post

  comments.push({ id: commentId, content, status: "pending" }); // After pushing it into the comments array and this is the actual comment which we are pushing.
  // We are adding a new property which is status and by default it will be pending. After creating a comment we will immediately emit
  // "CommentCreated" event to the event bus and from the event bus it is sent to both the query service and the moderation service

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  }); // Here we are creating the "CommentCreated" event, In this "CommentCreated" event we are also sending the status which is
  // by default to "pending" state, So we have to add the status property to the data object. Now this event "CommentCreated" event will
  // go to the query service and then the query service will understand that a comment was created and it's status is pending.

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Received the event", req.body.type); // We are printing the type of the event that we have got
  // We are going to make sure that the comments service watches for the "CommentModerated" event

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    // The first thing we have to do inside here is pull out the comment that we have already stored inside of our data structure
    // commentsByPostId. So we need to find the appropriate comment that we have already stored inside of our data structure and update
    // the status of the comment with the new status that we have received from the event bus.
    const { postId, id, status, content } = data;

    const comments = commentsByPostId[postId]; // We are getting all the different comments that are associated with this postID
    // Now we have to iterate through this array of comments and find the comment that we have received from the event bus and update
    // the status of the comment with the new status that we have received from the event bus.
    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status; // We are updating the comment status

    // Now we have to emit the "CommentUpdated" event to the event bus by making a POST request and also include the comment with the
    // newly updated status.  Here we are telling to all other services such as Post service, Comment service, Query service and Moderation
    // service that a comment was updated.
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status, // The updated status
        postId, // The postId of this comment is associated with
        content,
      },
    });
  }

  res.send({});
}); // This end point is going to receive any event that is coming from the event bus

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
