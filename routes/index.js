const router = require("express").Router();

router.get("/", function (_req, res, _next) {
  res.status(200).json({
    type: "success",
    message: "Server is up and running",
  });
});

module.exports = router;
