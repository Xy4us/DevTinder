require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

//Middleware to parse JSON bodies of incoming requests
app.use(express.json());
//Middle ware to parse cookies from incoming requests
app.use(cookieParser());

const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);

//find user by email
// app.get("/user", async (req, res) => {
//   try {
//     const userEmail =
//       typeof req.query?.emailId === "string"
//         ? sanitizeString(req.query.emailId)
//         : req.body?.emailId;

//     if (!userEmail) {
//       return res.status(400).send("emailId query parameter is required");
//     }

//     if (!validator.isEmail(userEmail)) {
//       return res.status(400).send("Invalid email address -> " + userEmail);
//     }

//     const user = await User.findOne({ emailId: userEmail });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     return res.send(user);
//   } catch (err) {
//     return res.status(400).send("Something went wrong!");
//   }
// });

//Feed api - get feed -> get all the user form the database
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({}).select("-password -emailId -__v");
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong!");
//   }
// });

//Delete user by email
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;

//   try {
//     const user = await User.findByIdAndDelete(userId);
//     res.send("User deleted successfully!");
//   } catch (err) {
//     res.status(400).send("Something went wrong!");
//   }
// });

//Update the data of the user
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;

//   try {
//     const allowedUpdates = ["photoUrl", "about", "skills", "age", "gender"];

//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       allowedUpdates.includes(k),
//     );

//     if (!isUpdateAllowed) {
//       throw new Error(
//         "Invalid updates! You can only update photoUrl, about, skills, age, and gender.",
//       );
//     }

//     Object.keys(data).forEach((key) => {
//       if (typeof data[key] === "string") {
//         data[key] = sanitizeString(data[key]);
//       }
//     });

//     if (data.photoUrl && !validator.isURL(data.photoUrl)) {
//       throw new Error("Invalid photo URL");
//     }

//     if (data?.skills?.length > 5) {
//       throw new Error("A user can have a maximum of 5 skills.");
//     }

//     const user = await User.findByIdAndUpdate(userId, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });

//     res.json({
//       message: "User updated successfully",
//       user,
//     });
//   } catch (err) {
//     res.status(400).send("Update failed! " + err.message);
//   }
// });

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
