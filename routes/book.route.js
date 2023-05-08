const express = require("express");
const {
  getAllBooks,
  createBook,
  findBookById,
} = require("../controllers/books.controller");
const signin = require("../middleware/is-signin");

const router = express.Router();

router.get("/", signin, getAllBooks);
router.post("/create", signin, createBook);
router.get("/:bookId", findBookById);
module.exports = router;
