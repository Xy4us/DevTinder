const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
      match: [/^[a-zA-Z ]+$/, "Name can contain only letters"],
    },
    lastName: {
      type: String,
      maxLength: 50,
      trim: true,
      match: [/^[a-zA-Z ]+$/, "Name can contain only letters"],
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255,
      select: false, // Exclude password from query results by default
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message:
          "Password must contain uppercase, lowercase, number and special character",
      },
    },
    age: {
      type: Number,
      max: [120, "Age cannot exceed 120"],
      validate: {
        validator: function (value) {
          return value >= 16;
        },
        message: "Age must be at least 16",
      },
    },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender`,
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value.toLowerCase())) {
      //     throw new Error(
      //       "Invalid gender. Please choose from male, female, or others.",
      //     );
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",

      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default:
        "This is a default about section. Please update it to tell us more about yourself!",
    },
    skills: {
      type: [String],
      validate: [
        {
          validator: (skills) => skills.length <= 10,
          message: "A user can have a maximum of 10 skills.",
        },
        {
          validator: (skills) =>
            skills.every((skill) => skill.trim().length > 0),
          message: "Skills cannot be empty.",
        },
        {
          validator: (skills) =>
            new Set(skills.map((s) => s.toLowerCase())).size === skills.length,
          message: "Skills must be unique.",
        },
        {
          validator: (skills) =>
            skills.every((skill) => skill.trim().length <= 30),
          message: "Each skill can have a maximum of 30 characters.",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

//always write normal function coz of "this" keyword, as it dont work with arrow function
userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

//validating and comparing the password entered by user with the hashed password in the database
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  return isPasswordValid;
};

// Mongoose 9+ async pre-hooks use Promises — do NOT use the "next" parameter.
// Just return early or throw — Mongoose handles it automatically.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return; // password not changed, skip hashing
  }

  this.password = await bcrypt.hash(this.password, 10);
  // No need to call next() — Mongoose handles the resolved promise automatically
});
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
