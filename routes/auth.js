var express = require("express");
var router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");
const {
  fetchCurrentUser,
  resendOtp,
  get_auth,
  verifyPhoneOtp,
  handleAdmin,
} = require("../controllers/auth.controller");

router.get("/", function (req, res, next) {
  res.status(200).json({
    type: "success",
    message: "Auth service is running",
  });
});

router.post("/", get_auth);

router.post("/resend-otp", resendOtp);

router.post("/verify-otp", verifyPhoneOtp);

router.get("/verify-user", checkAuth, fetchCurrentUser);

router.get("/admin", checkAuth, checkAdmin, handleAdmin);

module.exports = router;
