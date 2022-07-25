var validator = require("email-validator");
var databases = require("../databases");
// middleware to check x-user email of request header

function emailCheck(req, res, next) {
  if (validator.validate(req.headers["x-user"])) {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const requestUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const requestMethod = req.method;
    databases.logging.insert({
      user: req.headers["x-user"],
      user_ip: ip,
      timestamp: new Date(),
      request_url: requestUrl,
      request_method: requestMethod,
    });
    next();
  } else {
    res.status(400).send({ statusCode: 400, error: "Bad Request", message: "Missing x-user in request header." });
  }
}

module.exports = emailCheck;
