var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../passportConfig")(passport);

const { JWT_SECRET } = require("../config");

router.get("/", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get("/callback", passport.authenticate("google", { session: false }), (req, res) => {
  passport.authenticate("google", { session: false }),
    (req, res) => {
      jwt.sign({ user: req.user }, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
        if (err) {
          return res.json({
            type: "error",
            data: {
              token: null,
            },
          });
        }
        res.json({
          type: "success",
          data: {
            token: token,
            user: req.user,
          },
        });
      });
    };
});

module.exports = router;
