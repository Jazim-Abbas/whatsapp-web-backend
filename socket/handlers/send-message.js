const messageService = require("../../services/message");

module.exports = (socket) => {
  return async (fields, ackCallback) => {
    const { messageBody, userId, channelId } = fields;

    const autoId = await messageService.getAutoIdForChannel({ channelId });
    const message = await messageService.saveMessage({ messageBody, userId, channelId, autoId });

    if (ackCallback) ackCallback(message);
  };
};
