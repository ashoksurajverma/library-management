const express = require("express");
const controller = require("../controllers/user.controller");
const router = express.Router();

router.get("/", controller.getUser);
router.post("/create", controller.createUser);

module.exports = router;
