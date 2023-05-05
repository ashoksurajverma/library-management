const express = require("express");
const router = express.Router();
const signin = require("../middleware/is-signin");

const { getTeachers } = require("../controllers/teacher.controller");

router.get("/", signin, getTeachers);
module.exports = router;
