// Imports
const router = require("express").Router();
const axios = require("axios");
const base_url = "https://app.moneytap.com";

async function fetchAccessToken() {
    try {
        const client_id = "dsa-creditmantra";
        // const client_secret = "saWGY4hF804GeVl";
        const client_secret = "cZd48CiXn6qc2L5";
        const credentials = `${client_id}:${client_secret}`;
        const encodedCredentials = btoa(credentials);
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedCredentials}`,
        };
        const response = await axios.post(`${base_url}/oauth/token?grant_type=client_credentials`, null, { headers });
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error.message);
        throw new Error("Failed to fetch access token");
    }
}

// Routes
router.post("/moneytap/create", async (req, res) => {
    console.log("Received request at /moneytap/create");
    try {
        const data = req.body;
        const accessToken = await fetchAccessToken();
        console.log("Access Token:", accessToken);
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.post(`${base_url}/v3/partner/lead/create`, data, { headers });
        res.json(response.data);
    } catch (error) {
        console.error("Error at create endpoint:", error.message);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.post("/moneytap/status", async (req, res) => {
    try {
        const { customerId } = req.body;
        const accessToken = await fetchAccessToken();
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.post(
            `${base_url}/v3/partner/lead/status`,
            { customerId: customerId },
            { headers },
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error ", error);
        res.status(500).json({ error: "Failed to fetch access token" });
    }
});

module.exports = router;
