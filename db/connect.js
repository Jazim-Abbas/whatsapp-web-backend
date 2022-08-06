const mongoose = require("mongoose");
const envVars = require("../utils/env-vars");

module.exports = async () => {
  try {
    await mongoose.connect(envVars.MONGO_URI);
    console.log("Database is Connected Successfully...");
  } catch (err) {
    console.log("MongoDB connection Error: ", err);
    process.exit(0);
  }
};
