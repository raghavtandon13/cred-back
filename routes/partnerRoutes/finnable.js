const router = require("express").Router();
const CryptoJS = require("crypto-js");
const axios = require("axios");
const finnableApiKey = "YOUR_FINNABLE_API_KEY";
const finnableApiUrl = "https://finnable-api-url.com";

router.post("/finnable", async (req, res) => {
    // Step 1
    try {
        const { mobileNo } = req.body;
        const timestamp = new Date().toISOString();
        const accessTokenData = `POST/accessToken${timestamp}`;
        const accessTokenSignature = CryptoJS.HmacSHA256(accessTokenData, finnableApiKey).toString(CryptoJS.enc.Hex);
        const accessTokenHeaders = {
            "finnable-api-key": finnableApiKey,
            "Content-Type": "application/json",
            "finnable-access-timestamp": timestamp,
            "finnable-api-signature": accessTokenSignature,
        };
        const accessTokenResponse = await axios.post(
            `${finnableApiUrl}/accessToken?mobileNo=${mobileNo}`,
            {},
            { headers: accessTokenHeaders },
        );
        const finnableAccessToken = accessTokenResponse.data.accessToken;
        // Step 2
        const sanctionData = req.body;
        delete sanctionData.mobileNo;
        const sanctionHeaders = {
            "finnable-access-token": finnableAccessToken,
            "Content-Type": "application/json",
        };
        const sanctionResponse = await axios.post(`${finnableApiUrl}/sanction`, sanctionData, {
            headers: sanctionHeaders,
        });
        const sanctionDecision = sanctionResponse.data;
        res.json({ sanctionDecision });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: "An error occurred while processing the Finnable request.",
        });
    }
});

module.exports = router;
