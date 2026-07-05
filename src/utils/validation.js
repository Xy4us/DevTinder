const validator = require("validator");

const sanitizeString = (str) => {
  return str.trim().replace(/[<>]/g, "");
};

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("First Name is required");
  }

  if (!lastName) {
    throw new Error("Last Name is required");
  }

  if (!emailId) {
    throw new Error("Email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  if (firstName.length < 2 || firstName.length > 50) {
    throw new Error("First Name must be between 2 and 50 characters");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Weak password. It must contain uppercase, lowercase, number and special character.",
    );
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
    "age",
    "gender",
  ];

  const data = req.body;

  const isEditAllowed = Object.keys(data).every((field) =>
    allowedEditFields.includes(field),
  );

  if (!isEditAllowed) {
    throw new Error("Invalid edit request");
  }

  if (data.photoUrl && !validator.isURL(data.photoUrl)) {
    throw new Error("Invalid photo URL");
  }

  if (data.skills && data.skills.length > 10) {
    throw new Error("A user can have a maximum of 10 skills.");
  }

  return true;
};

const validatePasswordUpdateData = (req) => {
  const { currentPassword, newPassword } = req?.body;

  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required.");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      "New password is weak. It must contain uppercase, lowercase, number and special character.",
    );
  }
};

module.exports = {
  validateSignUpData,
  sanitizeString,
  validateProfileEditData,
  validatePasswordUpdateData,
};
