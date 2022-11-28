const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async(req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentByPostId[req.params.id] || [];
  comments.push({ id: commentId, content });

  commentByPostId[req.params.id] = comments;

 await axios.post("http://localhost:3004/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.json(comments);
});


app.post("/events", (req, res) => {
  console.log("Event Received", req.body);

  res.send({});
});

app.listen(3002, () => {
  console.log("COMMENT server");
});
