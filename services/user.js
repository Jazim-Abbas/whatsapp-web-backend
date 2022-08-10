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
};

async function isUserExistsAndPasswordMatched(userInDb, password) {
  if (!userInDb) return false;
  return await userInDb.comparePassword(password);
}
