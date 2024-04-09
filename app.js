require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 1,
  handler: (req, res, next) => {
    const timeUntilReset = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) || 1;
    setTimeout(next, timeUntilReset * 1000);
  },
});

const { MONGODB_URI, API_VERSION } = require("./config");
// const { SERVER_ERR } = require("./errors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var googleAuthRouter = require("./routes/google_auth");
var partnerRouter = require("./routes/partner");
var partnerApi = require("./routes/partnerApi");
var leads = require("./routes/leads");
var app = express();

var allowlist = ["http://localhost:4200", "http://localhost:3000", "http://credmantra.com", "https://credmantra.com"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api" + API_VERSION + "/logos", express.static("logos"));

app.use("/api" + API_VERSION + "/", indexRouter);
app.use("/api" + API_VERSION + "/users", usersRouter);
app.use("/api" + API_VERSION + "/auth", authRouter);
app.use("/api" + API_VERSION + "/auth/google", googleAuthRouter);
app.use("/api" + API_VERSION + "/partner", partnerRouter);
app.use("/api" + API_VERSION + "/partner-api", partnerApi);
app.use("/api" + API_VERSION + "/leads", limiter, leads);
// app.use("/api" + API_VERSION + "/emi", emiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // set the status and error message
  res.status(err.status || 500);
});

async function main() {
  try {
    const connect = mongoose.connect(MONGODB_URI);
    connect.then(
      () => {
        console.log("Database connected");
      },
      (err) => {
        console.log(err);
      },
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();

module.exports = app;
