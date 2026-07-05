const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //Read the token
    const { token } = req?.cookies;

    if (!token) {
      throw new Error("Please login again.");
    }

    //Validate the token
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedObj;

    //Find the user
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found! Please login again.");
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in userAuth middleware", error);
    res.status(401).send("Unauthorized: " + error.message);
  }
};

module.exports = { userAuth };
