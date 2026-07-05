const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const { validatePasswordUpdateData } = require("../utils/validation");

//profile api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req?.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong! " + err.message);
  }
});

//profile edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // validateProfileEditData throws an Error if anything is invalid,
    // so no need for an if-check — any error is caught below
    validateProfileEditData(req);

    const loggedInUser = req?.user;
    const data = req?.body;

    //update the user data
    Object.keys(data).forEach((key) => (loggedInUser[key] = data[key]));
    //saved the data to the database
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} your profile has been updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Something went wrong! " + err.message);
  }
});

//profile password update api
profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    validatePasswordUpdateData(req);

    // Re-fetch the user WITH the password field.
    // Why? Because req.user is loaded by the middleware which does NOT fetch the password
    // (password has select:false in schema). Without this, loggedInUser.password would be
    // undefined and validatePassword() would always fail.
    const loggedInUser = await User.findById(req.user._id).select("+password");

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const isPasswordCorrect =
      await loggedInUser.validatePassword(currentPassword);

    if (!isPasswordCorrect) {
      throw new Error("Current password is incorrect.");
    }

    if (currentPassword === newPassword) {
      throw new Error("New password cannot be same as current password.");
    }

    //update the password
    loggedInUser.password = newPassword;
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} your password has been updated successfully!`,
    });
  } catch (err) {
    res.status(400).send("Something went wrong! " + err.message);
  }
});

module.exports = profileRouter;
