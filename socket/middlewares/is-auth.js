const jwt = require("jsonwebtoken");
const envVars = require("../../utils/env-vars");
const Exceptions = require("../../utils/custom-errors");

module.exports = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Exceptions.BadRequestError({ message: "Token not provided" }));
  }

  try {
    const decoded = jwt.verify(token, envVars.JWT_SECRET);
    socket.request.user = decoded;
    next();
  } catch (err) {
    next(new Exceptions.UnauthorizedError({ message: "Invalid token or maybe expired" }));
  }
};
