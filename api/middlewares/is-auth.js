const jwt = require("jsonwebtoken");
const envVars = require("../../utils/env-vars");
const Exceptions = require("../../utils/custom-errors");

module.exports = async function (req, res, next) {
  const token = req.headers["x-auth-token"] || req.headers["authorization"];
  if (!token) throw new Exceptions.UnauthorizedError({ message: "Access denied. No token provided" });

  try {
    const decoded = jwt.verify(token, envVars.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new Exceptions.UnauthorizedError({ message: "Invalid token" });
  }
};
