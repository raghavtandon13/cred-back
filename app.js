require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
// var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
const rateLimit = require("express-rate-limit");
const Users = require("./models/user.model");

mongoose.set("strictQuery", true);

// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

const { MONGODB_URI, API_VERSION } = require("./config");
const { SERVER_ERR } = require("./errors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var googleAuthRouter = require("./routes/google_auth");
var partnerRouter = require("./routes/partner");
var partnerApi = require("./routes/partnerApi");
var leads = require("./routes/leads")
var test = require("./routes/test");
var app = express();

var allowlist = ["http://localhost:4200", "http://localhost:3000"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));
//app.use(apiLimiter);

// view engine setup
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
app.use("/api" + API_VERSION + "/leads", leads);
app.use("/api" + API_VERSION + "/test", test);

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
  // res.json({
  //   status: err.status || 500,
  //   message: err.message || SERVER_ERR,
  // });
});

async function main() {
  try {
    const connect = mongoose.connect(MONGODB_URI);
    //mongoose.set('strictQuery', true); // add this line
    connect.then(
      () => {
        console.log("Database connected, running on 3000...");
        // logUserData();
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

async function logUserData() {
  try {
    const users = await Users.find({});
    console.log("Users:", users);
  } catch (error) {
    console.log(error);
  }
}

// REMOVE THIS
// process.on('warning', (warning) => {
//   if (warning.name === 'MongooseWarning' && warning.message.includes('`strictQuery` option')) {
//   } else {
//     console.warn(warning);
//   }
// });

main();

module.exports = app;
