const { request, response } = require("express");
const userService = require("../../services/user");
const validate = require("../../utils/validations");
const validations = require("../../utils/validations/user");

module.exports = {
  /**
   * @param {request} req
   * @param {response} res
   */
  makeFriend: async (req, res) => {
    const cleanFields = await validate(validations.makeFriendSchema, req.body);
    const channel = await userService.makeNewFriend({
      loggedInUserId: req.user._id,
      opponentUserId: cleanFields.opponendUserId,
    });
    res.send({ channel });
  },
};
