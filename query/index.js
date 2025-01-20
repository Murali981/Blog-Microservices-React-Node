const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {}; // This posts object is to store all posts and comments

// QUICK EXAMPLE
// posts === {
//   "j4p312": {
//     id: "j4p312", This is the id of the post
//     title: "Post 1", This is the title of the post
//     comments: [ An array of comments associated with this post
//       {
//         id: "j4p312", Every comment will have it's own ID
//         content: "Comment 1", The content of the comment
//       },
//     ],
//   },

//}

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] }; // By default comments is an empty array
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments?.push({ id, content, status }); // The newly pushed comment will have an ID and content and status , Here we are adding the
    // array of comments for a particular post
  }

  // We will watch for the CommentUpdated event then we are going to find the appropriate comment in our memory and then we are going to
  // update the status to the status which is inside the event (or) which is received from the event bus

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    // As a quick remainder we are storing all the posts inside a posts object. We are going to find all the appropriate comments with
    // the associated post and look at the array of comments and find the comment that we want to update

    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id; // We are finding the comment that we want to update
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts); // We are sending the entire posts object
});

app.post("/events", (req, res) => {
  // We are handling all the events that are comming here
  const { type, data } = req.body;

  handleEvent(type, data);
  res.send({});
}); // This is going to receive events from the event bus

app.listen(4002, async () => {
  console.log("Listening on 4002");

  // Whenever our query service comes online and it's listening on port 4002, Right after this it is a pretty good time to make a request
  // over to our event bus and try to get the list of all the different events that have been emitted till this point of time.

  try {
    // const res = await axios
    //   .get("http://localhost:4005/events")
    //   .catch((err) => {}); // This is going to return all the events that are occured during this point of
    // // time

    const res = await axios
      .get("http://event-bus-srv:4005/events")
      .catch((err) => {}); // This is going to return all the events that are occured during this point of
    // time

    for (let event of res.data) {
      console.log("Processing the event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
