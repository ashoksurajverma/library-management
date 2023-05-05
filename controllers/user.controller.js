const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

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

exports.signIn = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      loadedUser = user;
      if (!user) {
        const error = new Error("User does not exits");
        error.statusCode = 404;
        throw error;
      }
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Password is incorrect");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: email,
          userId: loadedUser._id.toString(),
        },
        "mypassword",
        { expiresIn: "3h" }
      );
      res.status(200).json({
        token,
        userId: loadedUser._id,
        email,
        message: "You have successfully logged in",
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.signin1 = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      loadedUser = user;
      if (!user) {
        const error = new Error("User does not exits");
        error.statusCode = 404;
        throw error;
      }
      return bcrypt.compare(password, user.password);
    })
    .then((isPsdEqual) => {
      if (!isPsdEqual) {
        const error = new Error("Password does not match");
        error.statusCode = 404;
        throw error;
      }
      const token = jwt.sign(
        {
          email,
          userId: loadedUser._id.toString(),
        },
        "mypassword",
        { expiresIn: "3h" }
      );
      res.status(200).json({
        token,
        email,
        userId: loadedUser._id,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
