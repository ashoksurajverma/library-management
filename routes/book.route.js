const express = require("express");
const { getAllBooks } = require("../controllers/books.controller");

const router = express.Router();

router.get("/", getAllBooks);

module.exports = router;
