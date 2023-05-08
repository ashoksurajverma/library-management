const getSingleAuthor = (authors) => {
  const d = [];
  authors.map((author) => {
    d.push({
      author,
      bookCount: author.books.length,
    });
  });
  return d;
};

module.exports = {
  getSingleAuthor,
};
