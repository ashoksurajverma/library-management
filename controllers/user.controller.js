const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const ResetToken = require("../models/reset-token.model");

exports.getUser = (req, res, next) => {
  try {
    User.find({ isVerified: true }).then((result) => {
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
            const secret = speakeasy.generateSecret({ length: 20 });
            const secretKey = secret.base32;

            const otp = speakeasy.totp({
              secret: secret.base32,
              encoding: "base32",
            });
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "sverma@technomatz.com",
                pass: "kanipura@@@477116#gmail",
              },
            });
            const mailOptions = {
              from: "sverma@technomatz.com",
              to: email,
              subject: "OTP Login & Screate",
              text: `Your OTP is ${otp} and ${secretKey}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                res.status(500).json({
                  error: true,
                  message: error.message,
                });
              } else {
                res.status(200).json({
                  message: `Please verify your email first, before login. OTP has been sent to you email: ${email}`,
                });
              }
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
exports.signupverify = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      // If user not found
      if (!user) {
        const error = new Error("User not found!!!");
        error.statusCode = 404;
        throw error;
      }

      // if we got a user, then we'll follow these steps
      const otp = req.body.otp;
      const secret = req.body.secret;
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: "base32",
        token: otp,
        window: 5,
      });

      if (verified) {
        user.isVerified = true;
        return user.save();
      } else {
        res.status(304).json({
          message: "OTP is not valid",
        });
      }
    })
    .then((savedUser) => {
      if (!savedUser) {
        const error = new Error("Invalid OTP");
        error.statusCode = 500;
        throw error;
      }

      const token = jwt.sign(
        {
          email: email,
          userId: savedUser._id.toString(),
        },
        "mypassword",
        { expiresIn: "3h" }
      );

      res.status(200).json({
        message: "Email verified successfully, Now you can login",
        token,
        email,
        userId: savedUser._id,
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

exports.changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  let loadedUser;
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("You can not change the password!!!");
        error.statusCode = 500;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(currentPassword, user.password);
    })
    .then((isMatched) => {
      if (!isMatched) {
        const error = new Error("password do not match!!!");
        error.statusCode = 500;
        throw error;
      }
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPass) => {
      loadedUser.password = hashedPass;
      return loadedUser.save();
    })
    .then((userSaved) => {
      res.status(200).json({
        message: "Password updated successfully",
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;
  const token = uuid.v4();
  const resetToken = new ResetToken({
    email: email,
    token: token,
  });

  resetToken
    .save()
    .then((savedToken) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sverma@technomatz.com",
          pass: "kanipura@@@477116#gmail",
        },
      });
      const resetUrl = `https://example.com/reset-password?token=${token}`;

      const mailOptions = {
        from: "sverma@technomatz.com",
        to: email,
        subject: "Reset your password",
        html: `Click <a href="${resetUrl}">here</a> to reset your password. token: ${token}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).json({
            error: true,
            message: error.message,
          });
        } else {
          res.status(200).json({
            message: "Password reset link has been sent to your gamil address",
          });
        }
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(next);
    });
};

exports.resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  const findToken = await ResetToken.findOne({ token: token });
  if (!findToken) {
    res.status(404).json({
      message: "Token is invalid, that you provide",
    });
  }
  const email = findToken.email;
  const user = await User.findOne({ email: email });
  const hashedPass = await bcrypt.hash(password, 12);
  user.password = hashedPass;
  user
    .save()
    .then((updatedUser) => {
      res.status(200).json({ message: "Your password has been updated !!!" });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
  // Verify the token
  // retrieve  the users email & verify it.
  // hash new password
  // update the user password
  // return response
};
