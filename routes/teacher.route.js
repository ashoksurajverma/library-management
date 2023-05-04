const express = require("express");
const router = express.Router();

// import controllers
const { getTeachers } = require("../controllers/teacher.controller");

router.get("/", getTeachers);
module.exports = router;
