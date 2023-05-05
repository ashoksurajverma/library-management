const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Please provide the Authorization");
    error.statusCode = 500;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    const error = new Error("Please provide the token");
    error.statusCode = 500;
    throw error;
  }
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, "mypassword");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  if (!decodeToken) {
    const error = new Error("Not Authorised !!");
    error.statusCode = 500;
    throw error;
  }

  req.userId = decodeToken.userId;

  next();
};
