const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = () => {
  if (type === "PostCreated") {
    console.log("post created");
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    console.log("comment created");
    const { id, postId, content, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    console.log("Comment Update");
    const { id, postId, content, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;


  res.send({});
});

app.listen(3003, () => {
  console.log("QUERY server");
});
