const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();
router.post("/make-new-friend", userController.makeFriend);

module.exports = router;
