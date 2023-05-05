const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetToken = new Schema({
  token: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("ResetToken", resetToken);
