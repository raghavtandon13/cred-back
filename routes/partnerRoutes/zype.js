const express = require("express");
const axios = require("axios");
const { createUser, updateUser } = require("../../middlewares/createUser");
const router = express.Router();

const domain = "https://prod.zype.co.in/attribution-service";
const partnerId = "66603df5a5168dbb6e95ec25";

router.post("/dedupe", async function (req, res) {
    try {
        const user = await createUser(req.body.mobileNumber);
        const data = { ...req.body, partnerId };
        const dedupeRes = await axios.post(
            `${domain}/api/v1/underwriting/customerEligibility`,
            data,
        );
        if (dedupeRes.data.status === "REJECT") {
            await updateUser(user, { name: "Zype", status: "Deduped" });
        }
        res.json(dedupeRes.data);
    } catch (error) {
        res.json(error.response.data);
    }
});

router.post("/offer", async function (req, res) {
    try {
        const user = await createUser(req.body.mobileNumber);
        const data = { ...req.body, partnerId };
        const offerRes = await axios.post(`${domain}/api/v1/underwriting/preApprovalOffer`, data);
        await updateUser(user, { name: "Zype", ...offerRes.data });
        res.json(offerRes.data);
    } catch (error) {
        res.json(error.response.data);
    }
});

module.exports = router;

// Request body examples

/* const DEDUPE_API_EXAMPLE = {
    mobileNumber: "xxx9999999",
    panNumber: "BNXPGGGG32",
    partnerId: "6fethgg1001",
}; */

/* const OFFER_API_EXAMPLE = {
    mobileNumber: "9977758201",
    email: "john.doe@gmail.com",
    panNumber: " BNXPGGGG32",
    name: "john doe",
    dob: "2001-08-23",
    employmentType: "salaried",
    income: 100000,
    partnerId: "",
    orgName: "",
    bureauType: 3,
}; */
