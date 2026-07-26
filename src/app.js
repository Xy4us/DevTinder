require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
  }),
);
//Middleware to parse JSON bodies of incoming requests
app.use(express.json());
//Middle ware to parse cookies from incoming requests
app.use(cookieParser());

const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(7777, () => {
      console.log("Server is running on http://localhost:7777");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
