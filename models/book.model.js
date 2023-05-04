const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  bookId: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  subject: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Book", bookSchema);
