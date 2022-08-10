const yup = require("yup");

module.exports = {
  searchSchema: yup.object().shape({
    username: yup.string().required().label("Username"),
  }),
  makeFriendSchema: yup.object().shape({
    opponendUserId: yup.string().required().label("Opponent User ID"),
  }),
};
