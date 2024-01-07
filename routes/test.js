
var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var axios = require("axios");

router.get("/", function (req, res, next) {
  res.status(200).json({
    type: "success",
    message: "partnerapi service is running",
  });
});

module.exports = router;