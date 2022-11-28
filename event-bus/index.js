const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;

  events.push(event);

  await axios.post("http://localhost:3001/events", event).catch((err) => {
    console.log(err.message);
  });
  await axios.post("http://localhost:3002/events", event).catch((err) => {
    console.log(err.message);
  });

  await axios.post("http://localhost:3003/events", event).catch((err) => {
    console.log(err.message);
  });

  await axios.post("http://localhost:3004/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: "Ok" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(3005, () => {
  console.log("EVENT started");
});
