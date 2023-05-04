exports.getAllBooks = (req, res, next) => {
  res.status(200).json({
    data: [],
    success: true,
  });
};
