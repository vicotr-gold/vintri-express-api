var validator = require("email-validator");
var databases = require("../databases");
// middleware to check x-user email of request header

function emailCheck(req, res, next) {
  if (validator.validate(req.headers["x-user"])) {
    next();
  } else {
    res.status(400).send({ statusCode: 400, error: "Bad Request", message: "Missing x-user in request header." });
  }
}

module.exports = emailCheck;
