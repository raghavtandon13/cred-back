// Imports
const router = require("express").Router();
const axios = require("axios");
const { createUser, addToUser } = require("../../middlewares/createUser");
const User = require("../../models/user.model");
const domain = "api.mpkt.in";
const headers = { "Content-Type": "application/json", "api-key": "3BB5E7A7E44345988BC9111F4C975 " };

// const domain = "stg-api.mpkt.in";
// const headers = { "Content-Type": "application/json", "api-key": "59D8AB0B311246C58001D9363D35A" };

router.post("/dedupe", async (req, res) => {
    try {
        const { mobileNumber, email } = req.body;
        const data = {
            email: Buffer.from(email).toString("base64"),
            mobileNumber: Buffer.from(mobileNumber).toString("base64"),
        };
        console.log(data);
        const response = await axios.post(`https://${domain}/acquisition-affiliate/v1/dedupe/check`, data, {
            headers: headers,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error at mpocket/dedupe:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/lead", async (req, res) => {
    try {
        const data = req.body;
        const user = await createUser(req.body.mobile_no);
        const response = await axios.post(`https://${domain}/acquisition-affiliate/v1/user`, data, {
            headers: headers,
        });
        await addToUser(user, { name: "Mpocket", id: response.data.data.request_id });
        res.json(response.data);
    } catch (error) {
        console.error("Error at mpocket/lead:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/bulk", async (req, res) => {
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

router.post("/status", async (req, res) => {
    try {
        const { request_id } = req.body;
        const response = await axios.post(
            `https://${domain}/acquisition-affiliate/v1/user?request_id=${request_id}`,
            data,
            { headers: headers },
        );
        await User.updateOne(
            { accounts: { $elemMatch: { name: "Mpocket", id: request_id } } },
            { $set: { "accounts.$.response": response.data.data } },
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error at mpocket/status:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

module.exports = router;
