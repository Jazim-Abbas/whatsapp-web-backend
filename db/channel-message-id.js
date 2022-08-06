const mongoose = require("mongoose");

const channelLastMessageID = new mongoose.Schema({
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  lastUsedID: Number,
});

const ChannelLastMessageID = mongoose.model("ChannelLastMessageID", channelLastMessageID);
module.exports = ChannelLastMessageID;
