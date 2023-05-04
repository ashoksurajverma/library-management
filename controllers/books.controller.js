const Book = require("../models/book.model");

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((result) => {
      res.status(200).json({
        data: result,
        success: true,
        count: result.length,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
    });
};

exports.createBook = (req, res, next) => {
  const book = new Book({
    bookId: req.body.bookId,
    name: req.body.name,
    author: req.body.author,
    subject: req.body.subject,
  });
  book
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Book is created",
        success: true,
        result,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(200);
    });
};
