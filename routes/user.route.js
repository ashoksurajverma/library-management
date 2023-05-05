const express = require("express");
const controller = require("../controllers/user.controller");
const router = express.Router();

router.get("/", controller.getUser);
router.post("/signup", controller.signup);
router.post("/signin", controller.signin1);
router.post("/create", controller.createUser);

module.exports = router;
