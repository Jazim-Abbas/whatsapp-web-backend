const mongoose = require("mongoose");

const userActivity = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  lastSeenMessageAutoId: Number,
  lastSeenMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  lastSeenMessageStatus: String,
});

const UserActivity = mongoose.model("UserActivity", userActivity);
module.exports = UserActivity;
