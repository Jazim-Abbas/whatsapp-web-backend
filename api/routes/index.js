const express = require("express");

const router = express.Router();
router.get("/", (_, res) => {
  // for Health Check
  res.send("This service is up and running...");
});

module.exports = router;
