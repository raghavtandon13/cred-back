var express = require("express");
const checkAdmin = require("../middlewares/checkAdmin");
const checkAuth = require("../middlewares/checkAuth");
const Partner = require("../models/partner.model");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/all", async (req, res) => {
  try {
    const partners = await Partner.find();
    res.json(partners);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/emi", (req, res) => {
  const { P, R, N } = req.body;

  if (!P || !R || !N) {
    return res.status(400).json({ message: "Please provide all three numbers" });
  }
  const iR = R / 12;
  console.log(iR);
  const denominator = Math.pow(1 + iR * 0.01, N) - 1;
  const EMI = (P * iR * 0.01 * Math.pow(1 + iR * 0.01, N)) / denominator;

  // const EMI = Number(P) + Number(R) + Number(N);
  res.json({ EMI });
});

router.get("/search/:id", checkAuth, async function (req, res, next) {
  try {
    console.log("searching by id");
    const partnerId = req.params.id;
    // const partner = await Partner.findById(partnerId);
    const partner = await Partner.find({ name: partnerId });

    if (!partner) {
      console.log("not found");
      throw new Error("Partner not found");
    }

    res.status(200).json({
      status: 200,
      partner: partner,
      // ans: partner2,
    });
  } catch (err) {
    next({ status: 404, message: err.message });
  }
});

router.get("/micro-loan", async (req, res) => {
  try {
    const partners = await Partner.find({ type: "MicroLoan" });
    if (partners.length === 0) {
      return res.status(404).json({ message: "Micro Loan Partners not found" });
    }

    res.json(partners);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/pay-later", async (req, res) => {
  try {
    const partners = await Partner.find({ type: "payLater" });
    if (partners.length === 0) {
      return res.status(404).json({ message: "Pay Later Partners not found" });
    }

    res.json(partners);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/personal-loan", async (req, res) => {
  try {
    const partners = await Partner.find({ type: "personalLoan" });
    if (partners.length === 0) {
      return res.status(404).json({ message: "Personal Loan Partners not found" });
    }

    res.json(partners);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/credit-card", async (req, res) => {
  try {
    const partners = await Partner.find({ type: "creditCard" });
    if (partners.length === 0) {
      return res.status(404).json({ message: "Credit Card Partners not found" });
    }

    res.json(partners);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/", checkAuth, checkAdmin, async function (req, res, next) {
  try {
    const partner = new Partner(req.body);
    await partner.save();

    res.status(200).json({
      status: 200,
      partner: partner,
    });
  } catch (err) {
    next({ status: 404, message: err.message });
  }
});

module.exports = router;
