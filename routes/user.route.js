const express = require("express");
const controller = require("../controllers/user.controller");
const router = express.Router();
const signin = require("../middleware/is-signin");

router.get("/", signin, controller.getUser);
router.get("/fetch-user-books", controller.fetchUserAssignedBooks);
router.post("/signup", controller.signup);
router.post("/signup-verify", controller.signupverify);
router.post("/signin", controller.signin1);
router.post("/create", signin, controller.createUser);
router.put("/change-password", signin, controller.changePassword);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

module.exports = router;
