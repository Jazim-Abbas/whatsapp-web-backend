const yup = require("yup");

module.exports = {
  makeFriendSchema: yup.object().shape({
    opponendUserId: yup.string().required().label("Opponent User ID"),
  }),
};
