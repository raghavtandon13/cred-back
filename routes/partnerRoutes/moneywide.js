const router = require("express").Router();
const axios = require("axios");
const tokenApiUrl = "https://deployapigateway.moneywide.com/token";
const tokenApiCredentials = {
    client_id: "MWide",
    client_key: "hsdfgh*&^&dgdhg87",
    source: "MWide",
};

const losApiUrl = "https://deployapigateway.moneywide.com/api/connectorapi-updated-flow";
router.post("/moneywide", async (req, res) => {
    let authToken = "";
    try {
        const tokenResponse = await axios.post(tokenApiUrl, tokenApiCredentials);
        if (tokenResponse.data.status === "1") {
            authToken = tokenResponse.data.token;
            const losApiResponse = await axios.post(losApiUrl, req.body, {
                headers: {
                    "API-CLIENT": "MWide",
                    "API-KEY": authToken,
                },
            });
            res.json(losApiResponse.data);
        } else {
            res.status(500).json({ error: "Token generation failed" });
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "An error occurred" });
    }
});

module.exports = router;
