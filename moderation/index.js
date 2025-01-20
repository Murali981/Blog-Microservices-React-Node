const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// This moderation service will just watch for events, It will watch for the event type of CommentCreated then this moderation service will
// emit the comment moderated event. In this moderation service we will need only one route handler for the "/events" endpoint

app.post("/events", async (req, res) => {
  // Here we are going to receive the event from the event bus which is the broker and please remember that event is present on the req.body
  // property
  const { type, data } = req.body; // We are pulling out the type and the data property from the event object

  if (type === "CommentCreated") {
    // The first thing we have to do here is whether to approve or reject the comment
    const status = data.content.includes("orange") ? "rejected" : "approved"; // We are getting the content of the comment and if the
    // comment contains the word "orange" then we will reject the comment, If the comment does not contain the word "orange" then we will
    // approve the comment. After this we have to emit the "CommentModerated" event to the event bus by making a POST request and also
    // include the comment with newly updated status.

    // await axios.post("http://localhost:4005/events", {
    //   // our event bus is running on 4005 port
    //   type: "CommentModerated",
    //   data: {
    //     id: data.id,
    //     postId: data.postId,
    //     status,
    //     content: data.content,
    //   },
    // });

    await axios.post("http://event-bus-srv:4005/events", {
      // our event bus is running on 4005 port
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }

  res.send({}); // We have to send some response back otherwise this request handler is going to get stuck (or) hang
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
