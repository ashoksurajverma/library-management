const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    bookId: {
      type: String,
      require: true,
    },
    publisher: {
      type: String,
      require: true,
    },
    subject: {
      type: String,
      require: true,
    },
    authorName: {
      type: String,
      require: true,
    },
    writer: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
