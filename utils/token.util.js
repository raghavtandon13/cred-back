const jwt = require("jsonwebtoken");
const { JWT_DECODE_ERR } = require("../errors");
const { JWT_SECRET } = require("../config");

exports.createJwtToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET);
  //, { expiresIn: "12h" }
  return token;
};

exports.verifyJwtToken = (token, next) => {
  try {
    const { user } = jwt.verify(token, JWT_SECRET);
    return user;
  } catch (err) {
    next(err);
  }
};
