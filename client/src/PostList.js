/* eslint-disable */

import React, { useEffect, useState } from "react";

import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

export default () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    // const res = await axios.get("http://localhost:4002/posts"); // A quick remainder, Anytime when we make a request to the axios,
    // we will get back a response object and the actual data is nested inside there on the data property. On port 4002 is where our
    // query service is running
    // console.log(res.data);

    const res = await axios.get("http://posts.com/posts"); // A quick remainder, Anytime when we make a request to the axios,
    // we will get back a response object and the actual data is nested inside there on the data property. On port 4002 is where our
    // query service is running
    // console.log(res.data);

    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  }); // Object.values() is a builtIn function in javascript that is going to give back an array of
  // all the values inside of the posts object above. It is going to give us an array of the values of the posts object.
  console.log(renderedPosts);

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};
