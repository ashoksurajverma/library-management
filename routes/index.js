// App routes
const express = require("express");
const router = express.Router();

const userRoutes = require("./user.route");
const studentRoutes = require("./student.route");
const teacherRoutes = require("./teacher.route");
const booksRoutes = require("./book.route");

router.use("/users", userRoutes);
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/books", booksRoutes);

module.exports = router;
