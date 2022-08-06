const Errors = require("../../utils/custom-errors");

module.exports = async function (err, _, res, __) {
  let statusCode = 500;
  let message = "Server error";
  let errors = [];

  console.log("Catch Errors: ", err);

  if (err instanceof Errors.HttpError) {
    if (err instanceof Errors.ValidationError) {
      errors = err.errors;
    }
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).send({ message, errors });
};
