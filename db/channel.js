const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  // which usres part of this channel
  users: {
    type: Map,
    of: String,
  },
  // which users has pinned this channel
  pinnedBy: {
    type: Map,
    of: String,
  },
});

const Channel = mongoose.model("Channel", channelSchema);
module.exports = Channel;
