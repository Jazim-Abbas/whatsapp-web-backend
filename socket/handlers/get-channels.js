const userService = require("../../services/user");

module.exports = (socket) => {
  return async (_, ackCallback) => {
    const userChannel = new UserChannel(socket);
    const channels = await userChannel.getUserChannels();

    console.log("user-channels: ", channels);

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
    await this.convertUserChannelsToMapAndAddOpponentUser();

    console.log("user-map ----: ", this._userChannelsMap);

    return this._userChannels;
  }

  async convertUserChannelsToMapAndAddOpponentUser() {
    await Promise.all(
      this._userChannels.map(async (channel) => {
        const opponentUserId = Array.from(channel.users.keys()).find((user) => user !== this._userId);
        const opponentUser = await userService.getUser(opponentUserId);

        this._userChannelsMap.set(channel._id, { ...channel._doc, ...opponentUser._doc });
      })
    );
  }
}
