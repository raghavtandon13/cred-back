// Load environment variables
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
const API_VERSION = process.env.API_VERSION;

// Middleware Setup
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize Express Application
const app = express();

// CORS Configuration
const allowlist = [
    "http://localhost:4200",
    "http://localhost:3000",
    "https://credmantra.com",
    "https://cred-front.vercel.app",
    "https://cred-db.vercel.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            const isAllowed = !origin || allowlist.includes(origin);
            callback(isAllowed ? null : new Error("Not allowed by CORS"), isAllowed);
        },
    }),
);

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const googleAuthRouter = require("./routes/google_auth");
const partnerRouter = require("./routes/partner");
const partnerApi = require("./routes/partnerApi");
const leads = require("./routes/leads");
const crm = require("./routes/crm");

app.use("/api" + API_VERSION + "/", indexRouter);
app.use("/api" + API_VERSION + "/users", usersRouter);
app.use("/api" + API_VERSION + "/auth", authRouter);
app.use("/api" + API_VERSION + "/auth/google", googleAuthRouter);
app.use("/api" + API_VERSION + "/partner", partnerRouter);
app.use("/api" + API_VERSION + "/partner-api", partnerApi);
app.use("/api" + API_VERSION + "/leads", leads);
app.use("/api" + API_VERSION + "/crm", crm);

// Error Handling Middleware
app.use(function (_req, _res, next) {
    next(createError(404));
});

app.use(function (err, req, res, _next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500).send();
});

// MongoDB Connection
mongoose.set("strictQuery", false);

async function main() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Database connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();

module.exports = app;
