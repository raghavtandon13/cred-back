// Imports
const axios = require("axios");
const router = require("express").Router();
const { createUser, addToUser } = require("../../middlewares/createUser");

// URLs
const fibeUrl = "https://api.socialworth.in/aggext-prod/esapi/generateTokenNew";
const profileIngestionUrl = "https://api.socialworth.in/aggext-prod/esapi/profile-ingestion";
const customerStatusUrl = "https://api.socialworth.in/aggext-prod/esapi/fetchcuststatus";
const numberResetUrl = "https://uatapi.socialworth.in/checkout-qa/escheckout/resetrecordqa";

// Routes
router.post("/fibe", async (req, res) => {
    try {
        const requestData = req.body;
        const { mobilenumber } = req.body;
        const user = await createUser(mobilenumber);
        const response1 = await axios.post(fibeUrl, {
            username: "CredMANTRAPrOd",
            password: "CredManTraPrOd@05012024!",
            applicationName: "APP",
        });
        const token = response1.data.token;
        const response2 = await axios.post(profileIngestionUrl, requestData, { headers: { Token: `${token}` } });
        const responseData = response2.data;
        await addToUser(user, {
            name: "Fibe",
            url: responseData.redirectionUrl,
            loanAmount: Math.max(responseData.sanctionLimit, responseData.inPrincipleLimit),
            id: responseData.customerid,
            status: responseData.status,
            res: responseData,
        });
        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ error: "TimedOut" });
    }
});

router.post("/fibe/customer-status", async (req, res) => {
    try {
        const response = await axios.post(customerStatusUrl, req.body, { headers: { Authorization: `${token}` } });
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

router.post("/fibe/number-reset", async (req, res) => {
    try {
        const response = await axios.post(numberResetUrl, req.body, { headers: { Authorization: `${token}` } });
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

module.exports = router;
