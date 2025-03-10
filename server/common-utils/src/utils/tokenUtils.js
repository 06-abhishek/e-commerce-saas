const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
