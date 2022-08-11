const sendMessageHanlder = require("../handlers/send-message");

module.exports = (io, chatNS, socket) => {
  console.log("chat-namespace - socket connected: ", socket.id);

  socket.on("msg-from-client", sendMessageHanlder(socket));
};
