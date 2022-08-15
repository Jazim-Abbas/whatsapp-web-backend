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

    this._userChannels.forEach((ch) => {
      if (this.isLastMessageSentByOpponentUser(ch)) {
        return this.makeResponseForMsgUnread(ch);
      }

      if (this.isLastMessageDeletedByLoggedInUser(ch)) {
        return this.makeResponseForMsgDeletion(ch);
      }

      if (this.isLastMessageSentByLoggedInUser(ch)) {
        return this.makeResponseForAllMsgsRead(ch);
      }

      return this.makeDefaultResponse(ch);
    });

    return this._userChannelRes;
  }

  async convertUserChannelsToMap_AddOpponentUser_AndUserActivity() {
    await Promise.all(
      this._userChannels.map(async (channel) => {
        const opponentUser = await this.getOpponentUser(channel.users);
        const userActivity = await this.getUserActivity(channel._id, this._userId);
        const opponentUserActivity = await this.getUserActivity(channel._id, opponentUser._id);

        const mapRecord = {
          ...channel._doc,
          ...opponentUser._doc,
          userActivity: userActivity._doc,
          opponentUserActivity: opponentUserActivity._doc,
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

  async getUserActivity(channelId, userId) {
    const record = await userActivityService.getUserActivity({ userId, channelId });
    return record || { _doc: {} };
  }

  isLastMessageDeletedByLoggedInUser(channel) {
    const { lastMessage } = channel;
    if (!lastMessage) return false;

    const { deletedBy } = lastMessage;
    if (!deletedBy) return false;

    return deletedBy[this._userId] !== null;
  }

  isLastMessageSentByOpponentUser(channel) {
    const { lastMessage } = channel;
    if (!lastMessage) return false;

    return lastMessage.user.toString() !== this._userId;
  }

  isLastMessageSentByLoggedInUser(channel) {
    const { lastMessage } = channel;
    if (!lastMessage) return false;

    return lastMessage.user.toString() === this._userId;
  }

  async makeResponseForMsgDeletion(channel) {
    this.makeResponse_PushToUserChannelsRes({
      channel,
      resObj: {
        unreadCount: 0,
        lastMessageReadStatus: "READ",
        lastMessage: channel.userActivity ? channel.userActivity.lastSeenMessage : {},
      },
    });
  }

  async makeResponseForMsgUnread(channel) {
    let lastSeenMessageAutoId = 0;
    if (channel.userActivity && channel.userActivity.lastSeenMessageAutoId) {
      lastSeenMessageAutoId = channel.userActivity.lastSeenMessageAutoId;
    }

    this.makeResponse_PushToUserChannelsRes({
      channel,
      resObj: {
        unreadCount: channel.lastMessage?.autoId - lastSeenMessageAutoId,
        lastMessageReadStatus: "DELIVERED",
      },
    });
  }

  async makeResponseForAllMsgsRead(channel) {
    // TODO: not implemented yet
    // get user activity for opponent user as well
    // one thing I can do: instead multipe docs created for each channel and user
    // what we can do create just one doc per channel and record all user activities there
    const opponentUserActivity = channel.opponentUserActivity ?? {};
    const opponentUserUnreadCount = channel.lastMessage?.autoId - opponentUserActivity.lastSeenMessageAutoId ?? 0;
    let messageStatus = "NOT_DELIVERED";

    if (opponentUserUnreadCount > 0 && channel.lastSeen) {
      const isUserActiveAfterLastMsg = new Date(channel.lastMessage.timestamp).getTime() < new Date(channel.lastSeen).getTime();
      messageStatus = isUserActiveAfterLastMsg ? "DELIVERED" : "NOT_DELIVERED";
    }

    if (opponentUserUnreadCount === 0 && channel.lastMessage && channel.lastSeen) {
      messageStatus = "READ";
    }

    this.makeResponse_PushToUserChannelsRes({
      channel,
      resObj: {
        unreadCount: 0,
        lastMessageReadStatus: messageStatus,
      },
    });
  }

  async makeDefaultResponse(channel) {
    this.makeResponse_PushToUserChannelsRes({
      channel,
      resObj: {},
    });
  }

  /**
   * @param {{
   *    channel: any
   *    resObj: {
   *        lastMessageReadStatus: "DELIVERED" | "NOT_DELIVERED" | "READ"
   *        unreadCount: number
   *        lastMessage: any
   *    }
   * }} params
   */
  async makeResponse_PushToUserChannelsRes(params) {
    const { channel, resObj } = params;

    this._userChannelRes.push({
      channelId: channel._id,
      channelName: channel.name,
      channelImage: channel.profilePicURL,
      lastMessage: resObj.lastMessage ?? channel.lastMessage,
      unreadCount: resObj.unreadCount ?? 0,
      lastMessageReadStatus: resObj.lastMessageReadStatus ?? "READ",
    });
  }
}
