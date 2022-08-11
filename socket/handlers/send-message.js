const messageService = require("../../services/message");

module.exports = (socket) => {
  return async (fields, ackCallback) => {
    const { messageBody, userId, channelId } = fields;

    const message = await messageService.saveMessage({ messageBody, userId, channelId, autoId: 1 });

    if (ackCallback) ackCallback(message);
  };
};
