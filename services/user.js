const db = require("../db");
const Exceptions = require("../utils/custom-errors");

module.exports = {
  /**
   * @param {string} username
   */
  searchUsers: async (username) => {
    return db.User.find({
      name: { $regex: ".*" + username + ".*", $options: "i" },
    }).select("name email profilePicURL");
  },
  /**
   * @param {string} userId
   */
  getUserChannelsWithLastMessage: async (userId) => {
    const populatedFields = {
      path: "channels",
      populate: { path: "lastMessage", model: "Message" },
    };
    const userChannels = await db.User.findById(userId).populate(populatedFields);
    return userChannels.channels;
  },
  /**
   * @param {string} userId
   */
  getUser: async (userId) => {
    return db.User.findById(userId).select("name email profilePicURL");
  },
  /**
   * @param {{
   *  name: string
   *  email: string
   *  password: string
   * }} record
   */
  createNewUser: async (record) => {
    try {
      const newUser = new db.User(record);
      return await newUser.save();
    } catch (err) {
      throw new Exceptions.BadRequestError({ message: "Please. Try different email" });
    }
  },
  /**
   * @param {{
   *  email: string
   *  password: string
   * }} record
   */
  loginUser: async (record) => {
    const { email, password } = record;
    const userInDb = await db.User.findOne({ email });

    if (!(await isUserExistsAndPasswordMatched(userInDb, password))) {
      throw new Exceptions.BadRequestError({ message: "Your credentials not matched" });
    }

    return userInDb;
  },
  /**
   * @param {{
   *  loggedInUserId: string
   *  opponentUserId: string
   * }} record
   */
  makeNewFriend: async (record) => {
    const { loggedInUserId, opponentUserId } = record;

    await checkUserAlreadyHasChannelWithOpponentUser(loggedInUserId, opponentUserId);
    const channel = await createChannel(loggedInUserId, opponentUserId);
    await addOpponentUserToUserChannel(loggedInUserId, channel._id);
    await addOpponentUserToUserChannel(opponentUserId, channel._id);

    return channel;
  },
};

async function isUserExistsAndPasswordMatched(userInDb, password) {
  if (!userInDb) return false;
  return await userInDb.comparePassword(password);
}

async function checkUserAlreadyHasChannelWithOpponentUser(loggedInUserId, opponendUserId) {
  const userRecord = await db.User.findById(loggedInUserId).populate("channels").select("channels");
  userRecord.channels.forEach((ch) => {
    const isChannelAlreadyExists = ch.users && ch.users.has(loggedInUserId) && ch.users.has(opponendUserId);
    if (isChannelAlreadyExists) {
      throw new Exceptions.BadRequestError({ message: "Already channel exists with the user" });
    }
  });
}

async function createChannel(userA, userB) {
  const channelUsers = {
    [userA]: "user",
    [userB]: "user",
  };
  return db.Channel.create({ users: channelUsers });
}

async function addOpponentUserToUserChannel(userId, channelId) {
  const userInDb = await db.User.findById(userId);
  if (!userInDb) {
    throw new Exceptions.BadRequestError({ message: userId + " is not found" });
  }

  userInDb.channels.push(channelId);
  await userInDb.save();
}
