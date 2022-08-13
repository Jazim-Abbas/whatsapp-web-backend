const db = require("../db");
const Exceptions = require("../utils/custom-errors");

module.exports = {
  /**
   * @param {{ userId: string, channelId: string}} params
   */
  getUserActivity: async (params) => {
    const { userId, channelId } = params;
    return db.UserActivity.findOne({ user: userId, channel: channelId });
  },
};
