const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://yanivamon:ynybmvn1400@cluster0.umh0mcl.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server running on port 8000");
});

const Interest = require("./models/intrests");


app.post("/add-interest", (req, res) => {
    const interests = req.body.interests;  // Extract interests from the 'interests' array
    console.log("Received interests:", interests);
  
    const names = interests.map(interest => interest.name); // Extract names from the array of interests
  
    Interest.create({ name: names }) // Save the names as an array
      .then(() => {
        res.status(200).json({ message: "Interests added successfully" });
      })
      .catch((err) => {
        console.log("Error adding interests", err);
        res.status(500).json({ message: "Error adding interests" });
      });
  });

app.get("/interests", (req, res) => {
  Interest.find()
    .then((interests) => {
      res.status(200).json(interests);
    })
    .catch((err) => {
      console.log("Error retrieving interests", err);
      res.status(500).json({ message: "Error retrieving interests" });
    });
});
