const Book = require("../models/book.model");
const Author = require("../models/author.model");

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
  // "bookId": "dfsdfsdf",
  // "publisher": "tech",
  // "subject": "Programming c",
  // "authorName": "Suraj",
  // "writer": "6458d45814fc01af3be68d60"
  const book = new Book({
    bookId: req.body.bookId,
    publisher: req.body.publisher,
    subject: req.body.subject,
    authorName: req.body.authorName,
    writer: req.body.writer,
  });
  let savedBook;
  book
    .save()
    .then(async (result) => {
      savedBook = result;
      return Author.findById(req.body.writer);
    })
    .then((author) => {
      author.books.push(savedBook);
      return author.save();
    })
    .then((author) => {
      res.status(201).json({
        message: "Book is created",
        success: true,
        result: savedBook,
        author: author,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(200);
    });
};
