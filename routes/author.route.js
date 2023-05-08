const express = require("express");
const router = express.Router();
const {
  createAuthor,
  getAllAuthors,
} = require("../controllers/author.controller");

router.get("/", getAllAuthors);
router.post("/create", createAuthor);
module.exports = router;
