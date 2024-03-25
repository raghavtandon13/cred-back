var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.status(200).json({
    type: "success",
    message: "partnerapi service is running",
  });
});

module.exports = router;
