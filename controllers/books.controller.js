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

exports.findBookById = (req, res, next) => {
  const { bookId } = req.params;

  Book.findById(bookId)
    .then((book) => {
      if (!book) {
        const error = new Error("Not found this book");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        success: true,
        book,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.getOnlyNonIssuedBook = (req, res, next) => {
  Book.find({ issued: true })
    .then((books) => {
      res.status(200).json({
        success: true,
        books,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
