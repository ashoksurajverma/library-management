const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// App routes
const userRoutes = require("./routes/user.route");
const studentRoutes = require("./routes/student.route");
const teacherRoutes = require("./routes/teacher.route");
const booksRoutes = require("./controllers/books.controller");

const app = express();

const PORT = 8081;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Handle all user routes
app.use("/v1/users", userRoutes);
app.use("/v1/students", studentRoutes);
app.use("/v1/teachers", teacherRoutes);
app.use("/v1/books", booksRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({
    error: true,
    message: error.message,
  });
});
mongoose
  .connect("mongodb://127.0.0.1:27017/libray-management")
  .then(() => {
    console.log("Connected to the DB");
    app.listen(PORT, () => {
      console.log("Server is running on port: " + PORT);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to DB");
  });
