const { request, response } = require("express");
const validate = require("../../utils/validations");
const validations = require("../../utils/validations/auth");

module.exports = {
  /**
   * @param {request} req
   * @param {response} res
   */
  register: async (req, res) => {
    const cleanFields = await validate(validations.registerSchema, req.body);
    res.send({ cleanFields });
  },
  /**
   * @param {request} req
   * @param {response} res
   */
  login: async (req, res) => {
    const cleanFields = await validate(validations.loginSchema, req.body);
    res.send({ cleanFields });
  },
};
