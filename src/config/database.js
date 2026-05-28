const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://xy4us_db:WRWsoxDWE2i9l8kH@cluster0.8azesil.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
