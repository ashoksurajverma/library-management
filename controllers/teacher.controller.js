const User = require("../models/user.model");

exports.getTeachers = (req, res, next) => {
  User.find({ role: "teacher" })
    .then((results) => {
      res.status(200).json({
        teachers: results,
        count: results.length,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
