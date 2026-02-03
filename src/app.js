const express = require("express");

const app = express(); // creating an express application

app.use("/hello", (req, res) => {
  res.send("Hello, World!");
});

app.use("/hi", (req, res) => {
  res.send("Hi, World!");
});

app.use("/test", (req, res) => {
  res.send("Hello from server!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
