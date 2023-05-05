const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
// const Post = require("../model/post.model");

exports.getUser = (req, res, next) => {
  try {
    User.find().then((result) => {
      res.status(200).json({
        message: "success 121",
        result,
      });
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

exports.createUser = (req, res, next) => {
  console.log(req);

  const user = new User({
    firstName: req.body?.firstName,
    lastName: req.body?.lastName,
    role: req.body?.role,
  });
  user
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        data: result,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(next);
    });
};

exports.signup = (req, res, next) => {
  const { firstName, lastName, role, password, email } = req.body;

  console.log("================>>>>>", firstName, lastName, role, password);
  User.find({ email: email })
    .then((userExits) => {
      if (userExits.length) {
        const error = new Error("User already exits");
        error.statusCode = 500;
        throw error;
      }
      bcrypt.hash(password, 12).then((hashPsw) => {
        const user = new User({
          firstName: firstName,
          lastName: lastName,
          password: hashPsw,
          role: role,
          email: email,
        });
        user
          .save()
          .then((result) => {
            console.log(result);
            res.status(200).json({
              data: result,
            });
          })
          .catch((error) => {
            if (!error.statusCode) {
              error.statusCode = 500;
            }
            next(next);
          });
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
