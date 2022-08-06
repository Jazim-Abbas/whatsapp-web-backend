const yup = require("yup");

module.exports = {
  registerSchema: yup.object().shape({
    name: yup.string().min(8).max(50).required().label("Name"),
    email: yup.string().email().required().label("Email"),
    password: yup.string().min(8).max(30).required().label("Password"),
  }),
};
