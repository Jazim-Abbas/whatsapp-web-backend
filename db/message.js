const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  body: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
  deletedBy: {
    type: Map,
    of: String,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  autoId: Number,
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
