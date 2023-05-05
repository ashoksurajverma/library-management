const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");

// App routes
const userRoutes = require("./routes/user.route");
const studentRoutes = require("./routes/student.route");
const teacherRoutes = require("./routes/teacher.route");
const booksRoutes = require("./routes/book.route");

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

app.post("/login", (req, res) => {
  const email = req.body.email;
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
        message: `OTP has been sent to you email: ${email}`,
      });
    }
  });
});

app.post("/login/verify", (req, res) => {
  const otp = req.body.otp;
  const secret = req.body.secret;
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: otp,
    window: 1,
  });
  if (verified) {
    res.send("OTP verified");
  } else {
    res.send("Invalid OTP");
  }
});

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
