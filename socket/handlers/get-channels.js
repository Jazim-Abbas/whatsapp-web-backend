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

  constructor(socket) {
    this._socket = socket;
  }

  async getUserChannels() {
    const userId = this._socket.request.user._id;
    const userChannels = await userService.getUserChannelsWithLastMessage(userId);

    return userChannels;
  }
}
