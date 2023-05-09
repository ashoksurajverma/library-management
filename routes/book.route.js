const express = require("express");
const {
  getAllBooks,
  createBook,
  findBookById,
  getOnlyNonIssuedBook,
  assignBookToUser,
} = require("../controllers/books.controller");
const signin = require("../middleware/is-signin");

const router = express.Router();

router.get("/", signin, getAllBooks);
router.post("/create", signin, createBook);
router.get("/get-available-books", getOnlyNonIssuedBook);
router.post("/assign-book", assignBookToUser);
router.get("/:bookId", findBookById);

module.exports = router;
