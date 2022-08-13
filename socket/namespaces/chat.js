const sendMessageHanlder = require("../handlers/send-message");
const getUserChannelsHandler = require("../handlers/get-channels");

module.exports = (io, chatNS, socket) => {
  console.log("chat-namespace - socket connected: ", socket.id);

  socket.on("msg-from-client", sendMessageHanlder(socket));
  socket.on("get-user-channels", getUserChannelsHandler(socket));
};
