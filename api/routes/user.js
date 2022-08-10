const express = require("express");
const isAuth = require("../middlewares/is-auth");
const userController = require("../controllers/user");

const router = express.Router();
router.post("/make-new-friend", isAuth, userController.makeFriend);

module.exports = router;
