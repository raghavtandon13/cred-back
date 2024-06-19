// Imports
const router = require("express").Router();
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { createUser, updateUser } = require("../../middlewares/createUser");
const domain = "https://loantap.in";
const uniquePartnerKey = Buffer.from("r3ib59DMkys14ipYeY4dCFkJExTQatiI", "utf8");
const crypto = require("crypto");

router.post("/", async (req, res) => {
    try {
        const apikey = generateXApiAuth(uniquePartnerKey);
        const headers = {
            "Content-Type": "application/json",
            "X-API-AUTH": apikey,
            "PARTNER-ID": "creadmantra",
            "REQ-PRODUCT-ID": "It-personal-term-loan-reducing",
        };
        const data = {
            add_application: {
                is_consent: "CM-" + uuidv4().replace(/-/g, ""),
                ...req.body.add_application,
            },
        };
        const user = await createUser(req.body.add_application.mobile_number);
        const response = await axios.post(`${domain}/v1-application/transact`, data, { headers: headers });
        await updateUser(user, { name: "LoanTap", ...response.data.add_application.answer });
        res.json(response.data);
    } catch (error) {
        console.error("Error at loantap:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

function generateXApiAuth(uniquePartnerKey) {
    const epochTime = Math.floor(Date.now() / 1000);
    console.log(epochTime);
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv("aes-256-cbc", uniquePartnerKey, iv);
    let encrypted = cipher.update(epochTime.toString(), "utf8", "base64");
    encrypted += cipher.final("base64");
    console.log(encrypted);
    return encrypted;
}

module.exports = router;
