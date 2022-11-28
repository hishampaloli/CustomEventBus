const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser")


const app = express();
app.use(bodyParser.json())

app.post("/events", async (req, res) => {
  const event = req.body;


  axios.post("http://localhost:3001/events", event);
 axios.post("http://localhost:3002/events", event);
  axios.post("http://localhost:3003/events", event);

  res.send({ status: "Ok" });
});

app.listen(3004, () => {
  console.log("EVENT started");
});
