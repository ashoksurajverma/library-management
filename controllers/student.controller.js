const User = require("../models/user.model");

exports.getStudents = (req, res, next) => {
  User.find({ role: "student" })
    .then((students) => {
      res.status(200).json({
        students,
        count: students.length,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
