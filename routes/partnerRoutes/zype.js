const express = require("express");
const axios = require("axios");
const router = express.Router();

const domain = "https://prod.zype.co.in/attribution-service";
const partnerId = "someshit";

router.post("/dedupe", async function (req, res) {
    try {
        const data = { ...req.body, partnerId };
        const dedupeRes = await axios.post(`${domain}/api/v1/underwriting/customerEligibility`, data);
        res.json(dedupeRes.data);
    } catch (error) {
        res.json(error.response.data);
    }
});

router.post("/offer", async function (req, res) {
    try {
        const data = { ...req.body, partnerId };
        const offerRes = await axios.post(`${domain}/api/v1/underwriting/preApprovalOffer`, data);
        res.json(offerRes.data);
    } catch (error) {
        res.json(error.response.data);
    }
});

module.exports = router;
