const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profilePicURL: String,
  lastSeen: Date,
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
