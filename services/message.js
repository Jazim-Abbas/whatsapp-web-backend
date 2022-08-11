const db = require("../db");

module.exports = {
  /**
   * @param {{
   *    messageBody: string
   *    userId: string
   *    channelId: string
   *    autoId: number
   * }} msgPayload
   */
  saveMessage: async (msgPayload) => {
    const { messageBody, userId, channelId, autoId } = msgPayload;
    return db.Message.create({
      body: messageBody,
      user: userId,
      channel: channelId,
      autoId: autoId,
    });
  },
};
