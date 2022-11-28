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

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: "pending" });

  commentByPostId[req.params.id] = comments;

  await axios
    .post("http://localhost:3005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    })
    .catch((err) => {
      console.log(err.message);
    });

  res.send({});
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Event Received", req.body);

  if (type === "CommentModerated") {
    console.log("comment Moderated");
    const { id, postId, content, status } = data;

    const comments = commentByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;

    await axios
      .post("http://localhost:3005/events", {
        type: "CommentUpdated",
        data: {
          id,
          postId,
          status,
          content,
        },
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  res.send({});
});

app.listen(3002, () => {
  console.log("COMMENT server");
});
