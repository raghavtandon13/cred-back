var express = require("express");
var router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");
const filterLenders = require("../utils/lenderlist.util");
const {
  fetchCurrentUser,
  resendOtp,
  get_auth,
  verifyPhoneOtp,
  handleAdmin,
  check_eli,
} = require("../controllers/auth.controller");

router.get("/", function (req, res, next) {
  res.status(200).json({
    type: "success",
    message: "Auth service is running",
  });
});

router.post("/", get_auth);

router.post("/eli", check_eli);

router.post("/resend-otp", resendOtp);

router.post("/verify-otp", verifyPhoneOtp);

router.get("/verify-user", checkAuth, fetchCurrentUser);

router.get("/admin", checkAuth, checkAdmin, handleAdmin);

router.post("/lender", async (req, res) => {
  const { dob, income, pincode } = req.body;
  const result = await filterLenders(dob, income, pincode);
  res.status(200).json({
    type: "success",
    data: result,
  });
});

module.exports = router;
