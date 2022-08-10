const { request, response } = require("express");
const userService = require("../../services/user");
const validate = require("../../utils/validations");
const validations = require("../../utils/validations/auth");

module.exports = {
  /**
   * @param {request} req
   * @param {response} res
   */
  register: async (req, res) => {
    const cleanFields = await validate(validations.registerSchema, req.body);
    await userService.createNewUser(cleanFields);
    res.send({ message: "Successfully created new user" });
  },
  /**
   * @param {request} req
   * @param {response} res
   */
  login: async (req, res) => {
    const cleanFields = await validate(validations.loginSchema, req.body);
    const userInDb = await userService.loginUser(cleanFields);
    res.send({ userInDb });
  },
};
