const express = require("express");

const app = express(); // creating an express application

//This will match only GET HTTP method API calls to /user endpoint
app.get("/user", (req, res) => {
  res.send({
    firstName: "John",
    lastName: "Doe",
  });
});

app.get(/^\/ab+cd$/, (req, res) => {
  res.send("This route matches /abc and /ac");
});

app.post("/user", (req, res) => {
  // Saving Data to DB
  res.send("Data Saved Successfully!");
});

app.patch("/user", (req, res) => {
  // Updating Data in DB
  res.send("Data Updated Successfully!");
});

app.delete("/user", (req, res) => {
  // Deleting Data from DB
  res.send("Data Deleted Successfully!");
});

//This will match all the HTTP methods API calls to test (eg. GET, POST, etc.)
app.use("/test", (req, res) => {
  res.send("Hello from server!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
