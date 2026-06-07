const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
    },
    age: {
      type: Number,
      min: 16,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error(
            "Invalid gender. Please choose from male, female, or others.",
          );
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
    },
    about: {
      type: String,
      default:
        "This is a default about section. Please update it to tell us more about yourself!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
