const express = require("express");
const { getAllBooks, createBook } = require("../controllers/books.controller");

const router = express.Router();

router.get("/", getAllBooks);
router.post("/create", createBook);
module.exports = router;
