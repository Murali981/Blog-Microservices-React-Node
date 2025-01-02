const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.get("/posts", (req, res) => {
  res.send(posts); // We are sending the entire posts object
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] }; // By default comments is an empty array
  }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;

    const post = posts[postId];
    post.comments?.push({ id, content }); // The newly pushed comment will have an ID and content
  }

  console.log(posts);

  res.send({});
}); // This is going to receive events from the event bus

app.listen(4002, () => {
  console.log("Listening on 4002");
});
