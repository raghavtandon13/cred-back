// Imports
const router = require("express").Router();

// Routes
const casheRouter = require("./partnerRoutes/cashe");
const faircentRouter = require("./partnerRoutes/faircent");
const fibeRouter = require("./partnerRoutes/fibe");
const finnableRouter = require("./partnerRoutes/finnable");
const finzyRouter = require("./partnerRoutes/finzy");
const lendingkartRouter = require("./partnerRoutes/lendingkart");
const moneytapRouter = require("./partnerRoutes/moneytap");
const moneyviewRouter = require("./partnerRoutes/moneyview");
const moneywideRouter = require("./partnerRoutes/moneywide");
const paymeRouter = require("./partnerRoutes/payme");
const prefrRouter = require("./partnerRoutes/prefr");
const upwardsRouter = require("./partnerRoutes/upwards");
const vittoRouter = require("./partnerRoutes/vitto");

router.use("/cashe", casheRouter);
router.use("/faircent", faircentRouter);
router.use("/fibe", fibeRouter);
router.use("/finnable", finnableRouter);
router.use("/finzy", finzyRouter);
router.use("/lendingkart", lendingkartRouter);
router.use("/moneytap", moneytapRouter);
router.use("/moneyview", moneyviewRouter);
router.use("/moneywide", moneywideRouter);
router.use("/payme", paymeRouter);
router.use("/prefr", prefrRouter);
router.use("/upwards", upwardsRouter);
router.use("/vitto", vittoRouter);

// Welcome
router.get("/", function(_req, res) {
    res.send("partnerapi service is running");
});

module.exports = router;
