const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

//Middleware to parse JSON bodies of incoming requests
app.use(express.json());

app.post("/signup", async (req, res) => {
  //Creating new instance of the UserModel
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User signed up successfully!");
  } catch (error) {
    console.error("Error signing up user", error);
    res.status(400).send("Error saving the user:" + error.message);
  }
  //Creating a new instance of the model and saving it to the database
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
