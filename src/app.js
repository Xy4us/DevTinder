require("dotenv").config();
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
});

//find user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.findOne({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Feed api - get feed -> get all the user form the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Delete user by email
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Update the data of the user
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("User updated successfully!");
  } catch (err) {
    res.status(400).send("Update failed! " + err.message);
  }
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
