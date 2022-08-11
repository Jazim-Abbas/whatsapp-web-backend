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
  /**
   * @param {{ channelId: string }} payload
   */
  getAutoIdForChannel: async (payload) => {
    const { channelId } = payload;
    const latestMessage = await getLatestLastMessage(channelId);
    return latestMessage.autoId ? latestMessage.autoId + 1 : 1;
  },
};

async function getLatestLastMessage(channelId) {
  const latestMsg = await db.Message.find({ channel: channelId }).sort({ timestamp: "desc" }).select("autoId");
  if (latestMsg && latestMsg[0]) {
    return latestMsg[0];
  }
  return {};
}
