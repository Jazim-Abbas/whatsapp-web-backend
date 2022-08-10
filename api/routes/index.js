const express = require("express");
require("express-async-errors");
const authRoutes = require("./auth");
const catchApiUnhandleExceptions = require("../middlewares/exception-handling");

const router = express.Router();
router.use(express.json());
router.get("/", (_, res) => {
  // for Health Check
  res.send("This service is up and running...");
});
router.use("/auth", authRoutes);
router.use(catchApiUnhandleExceptions);

module.exports = router;
