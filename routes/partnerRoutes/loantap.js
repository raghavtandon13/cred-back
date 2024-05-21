// Imports
const router = require("express").Router();
const axios = require("axios");
const { createUser, addToUser } = require("../../middlewares/createUser");
const domain = "domain.com";
const headers = { "Content-Type": "application/json", "api-key": apikey };

router.post("/mpocket/dedupe", async (req, res) => {
    console.log(body);
    try {
        const { mobileNumber, email } = req.body;
        const data = {
            email: Buffer.from(email).toString("base64"),
            mobileNumber: Buffer.from(mobileNumber).toString("base64"),
        };
        const response = await axios.post(`https://${domain}/acquisition-affiliate/v1/dedupe/chec`, data, {
            headers: headers,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error at mpocket/dedupe:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/mpocket/lead", async (req, res) => {
    try {
        const data = req.body;
        const response = await axios.post(`https://${domain}/acquisition-affiliate/v1/user`, data, {
            headers: headers,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error at mpocket/lead:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/mpocket/bulk", async (req, res) => {
    try {
        const data = req.body;
        const response = await axios.post(`https://${domain}/acquisition-affiliate/v1/bulk/user`, data, {
            headers: headers,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error at mpocket/bulk:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/mpocket/status", async (req, res) => {
    try {
        const { request_id } = req.body;
        const response = await axios.post(
            `https://${domain}/acquisition-affiliate/v1/user?request_id=${request_id}`,
            data,
            { headers: headers },
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error at mpocket/status:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});
