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
