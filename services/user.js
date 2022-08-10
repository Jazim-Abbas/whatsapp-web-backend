const db = require("../db");
const Exceptions = require("../utils/custom-errors");

module.exports = {
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
};
