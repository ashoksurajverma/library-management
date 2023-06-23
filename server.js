const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./routes/index");

const app = express();

const PORT = 8081;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/v1", router);
// Handle all user routes

// Handle all globals errors
app.use((error, req, res, next) => {
  res.status(500).json({
    error: true,
    message: error.message,
  });
});

mongoose
  .connect("mongodb+srv://sverma:Suraj12345@cluster0.ih9h4el.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the DB");
    app.listen(PORT, () => {
      console.log("Server is running on port: " + PORT);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to DB", error);
  });
