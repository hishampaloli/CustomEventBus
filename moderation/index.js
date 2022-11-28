const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());


const handleModeration = async (type, data) => {
    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
    
        await axios.post('http://localhost:3005/events', {
          type: 'CommentModerated',
          data: {
            id: data.id,
            postId: data.postId,
            status,
            content: data.content
          }
        }).catch((err) => {
            console.log(err.message);
          });
      }
}

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

handleModeration(type, data)

  res.send({})
});




app.listen(3004, async () => {
    console.log("QUERY server");
  
    try {
      const res = await axios.get("http://localhost:3005/events");
  
      for (let event of res.data) {
        console.log("Processing event: ", event.type);
    
        handleModeration(event.type, event.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  
   
  });
  