var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/login", function (req, res, next) {
  const { email, password } = req.body;
  if (email && password) {
    res.send({ message: "Login Success." });
  }
});

module.exports = router;
