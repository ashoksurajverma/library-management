const express = require("express");
const { getStudents } = require("../controllers/student.controller");
const signin = require("../middleware/is-signin");

const router = express.Router();

router.get("/", signin, getStudents);

module.exports = router;
