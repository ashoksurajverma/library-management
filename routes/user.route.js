const express = require("express");
const controller = require("../controllers/user.controller");
const router = express.Router();
const signin = require("../middleware/is-signin");

router.get("/", signin, controller.getUser);
router.post("/signup", controller.signup);
router.post("/signup-verify", controller.signupverify);
router.post("/signin", controller.signin1);
router.post("/create", signin, controller.createUser);

module.exports = router;
