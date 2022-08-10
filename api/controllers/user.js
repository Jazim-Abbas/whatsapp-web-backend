const { request, response } = require("express");
const validate = require("../../utils/validations");
const validations = require("../../utils/validations/user");

module.exports = {
  /**
   * @param {request} req
   * @param {response} res
   */
  makeFriend: async (req, res) => {
    const cleanFields = await validate(validations.makeFriendSchema, req.body);
    res.send({ cleanFields });
  },
};
