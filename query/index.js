const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
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
  handleEvent(type, data);
  res.send({});
});

app.listen(3003, async () => {
  console.log("QUERY Server");

  try {
    const res = await axios.get("http://localhost:3005/events");

    for (let event of res.data) {
      console.log("Processing event: ", event.type);
  
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }

 
});
