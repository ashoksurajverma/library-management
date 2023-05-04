const express = require("express");
const { getStudents } = require("../controllers/student.controller");

const router = express.Router();

router.get("/", getStudents);

module.exports = router;
