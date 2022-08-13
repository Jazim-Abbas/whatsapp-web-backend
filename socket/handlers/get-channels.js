const userService = require("../../services/user");
const userActivityService = require("../../services/user-activity");

module.exports = (socket) => {
  return async (_, ackCallback) => {
    const userChannel = new UserChannel(socket);
    const channels = await userChannel.getUserChannels();

    if (ackCallback) ackCallback(channels);
  };
};

class UserChannel {
  _socket = null;
  _userId = null;
  _userChannels = [];
  _userChannelRes = [];
  _userChannelsMap = new Map();

  constructor(socket) {
    this._socket = socket;
  }

  async getUserChannels() {
    this._userId = this._socket.request.user._id;
    this._userChannels = await userService.getUserChannelsWithLastMessage(this._userId);
    await this.convertUserChannelsToMap_AddOpponentUser_AndUserActivity();

    console.log("user-map ----: ", this._userChannelsMap);

    return this._userChannels;
  }

  async convertUserChannelsToMap_AddOpponentUser_AndUserActivity() {
    await Promise.all(
      this._userChannels.map(async (channel) => {
        const opponentUser = await this.getOpponentUser(channel.users);
        const userActivity = await this.getUserActivity(channel._id);

        const mapRecord = {
          ...channel._doc,
          ...opponentUser._doc,
          userActivity: userActivity._doc,
        };
        this._userChannelsMap.set(channel._id, mapRecord);
      })
    );
  }

  /**
   * @param {Map} channelUsers
   */
  async getOpponentUser(channelUsers) {
    const opponentUserId = Array.from(channelUsers.keys()).find((user) => user !== this._userId);
    const opponentUser = await userService.getUser(opponentUserId);
    return opponentUser;
  }

  async getUserActivity(channelId) {
    const record = await userActivityService.getUserActivity({ userId: this._userId, channelId });
    return record || { _doc: {} };
  }
}
