const express = require("express");
const router = express.Router();
const checkAdmin = require("../middlewares/checkAdmin");
const checkAuth = require("../middlewares/checkAuth");
const Partner = require("../models/partner.model");

router.get("/", (_req, res) => res.send("respond with a resource"));

router.get("/all", async (_req, res) => {
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
    if (!P || !R || !N) return res.status(400).json({ message: "Please provide all three numbers" });

    const iR = R / 12;
    const denominator = Math.pow(1 + iR * 0.01, N) - 1;
    const EMI = (P * iR * 0.01 * Math.pow(1 + iR * 0.01, N)) / denominator;

    res.json({ EMI });
});

router.get("/search/:id", checkAuth, async (req, res, next) => {
    try {
        const partner = await Partner.findOne({ name: req.params.id });
        if (!partner) throw new Error("Partner not found");

        res.status(200).json({ status: 200, partner });
    } catch (err) {
        next({ status: 404, message: err.message });
    }
});

const findPartnersByType = async (_req, res, type) => {
    try {
        const partners = await Partner.find({ type });
        if (partners.length === 0) return res.status(404).json({ message: `${type} Partners not found` });
        res.json(partners);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

router.get("/micro-loan", (req, res) => findPartnersByType(req, res, "MicroLoan"));
router.get("/pay-later", (req, res) => findPartnersByType(req, res, "payLater"));
router.get("/personal-loan", (req, res) => findPartnersByType(req, res, "personalLoan"));
router.get("/credit-card", (req, res) => findPartnersByType(req, res, "creditCard"));

router.post("/", checkAuth, checkAdmin, async (req, res, next) => {
    try {
        const partner = new Partner(req.body);
        await partner.save();
        res.status(200).json({ status: 200, partner });
    } catch (err) {
        next({ status: 404, message: err.message });
    }
});

module.exports = router;
