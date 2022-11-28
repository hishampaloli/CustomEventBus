const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handlePosts = (type, data) => {
  
}

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post("http://localhost:3005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  }).catch((err) => {
    console.log(err.message);
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Event Received", req.body);

  res.send({});
});

app.listen(3001, () => {
  console.log("POST server");
});
