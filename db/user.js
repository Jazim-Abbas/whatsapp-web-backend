const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const envVars = require("../utils/env-vars");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  profilePicURL: String,
  lastSeen: Date,
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
});

userSchema.pre("save", hashPassword);
function hashPassword(next) {
  var user = this;

  if (!user.password) return next();

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
}

userSchema.method("comparePassword", async function (password) {
  return bcrypt.compare(password, this.password);
});

userSchema.method("generateJwtToken", function () {
  const payloadFields = getMinimalUserFields.bind(this)();
  return jwt.sign(payloadFields, envVars.JWT_SECRET);
});

userSchema.method("getMinimalUserFields", function () {
  return getMinimalUserFields.bind(this)();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

function getMinimalUserFields() {
  const { _id, name, email } = this._doc;
  return { _id, name, email };
}
