const userService = require("../../services/user");

module.exports = (socket) => {
  return async (fields, ackCallback) => {
    const userId = socket.request.user._id;
    const userChannels = await userService.getUserChannelsWithLastMessage(userId);

    console.log("user-channels: ", userChannels);

    if (ackCallback) ackCallback(userChannels);
  };
};
