module.exports = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/whatsapp-web",

  JWT_SECRET: process.env.JWT_SECRET_KEY || "secret-key-should-store-in-private-place",
};
