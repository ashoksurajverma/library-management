const express = require("express");
const { getAllBooks, createBook } = require("../controllers/books.controller");
const signin = require("../middleware/is-signin");

const router = express.Router();

router.get("/", signin, getAllBooks);
router.post("/create", signin, createBook);
module.exports = router;
