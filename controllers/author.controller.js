const Author = require("../models/author.model");
const { getSingleAuthor } = require("../services/author.service");

exports.getAllAuthors = (req, res, next) => {
  Author.find()
    .then((authors) => {
      res.status(200).json({
        success: true,
        authors: getSingleAuthor(authors),
        count: authors.length,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.createAuthor = (req, res, next) => {
  const { name, email, phoneNumber } = req.body;
  Author.findOne({ email: email })
    .then((exitsAuthor) => {
      if (exitsAuthor) {
        const error = new Error(
          "With this email address, Author is already register"
        );
        error.statusCode = 403;
        throw error;
      }
      const author = new Author({
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        books: [],
      });
      return author.save();
    })
    .then((savedAuthor) => {
      res.status(201).json({
        message: "Author successfully created",
        author: savedAuthor,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
