// Imports
const router = require("express").Router();
const axios = require("axios");
const User = require("../../models/user.model");
const { v4: uuidv4 } = require("uuid");
const { createUser, addToUser } = require("../../middlewares/createUser");
const host = "https://api.creditvidya.com";
const apikey = "fb49d37942c6687e1e74d424d1ab99e6";

router.post("/prefr/dedupe", async (req, res) => {
    console.log("Revieved request at /prefr/dedupe");
    const body = req.body;
    const headers = { "Content-Type": "application/json", apikey: apikey };
    const requestId = "CM-" + uuidv4().replace(/-/g, "");
    body["requestId"] = requestId;
    console.log(body);
    try {
        const response = await axios.post(`${host}/marketplace/mw/loans/v2/dedupe-service`, body, { headers: headers });
        res.json(response.data);
    } catch (error) {
        console.error("Error at prefer/dedupe:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/prefr/start", async (req, res) => {
    console.log("Revieved request at /prefr/start");
    const body = req.body;
    const headers = { "Content-Type": "application/json", apikey: apikey };
    const userId = "CMU-" + uuidv4().replace(/-/g, "");
    body["userId"] = userId;
    try {
        const response = await axios.post(`${host}/marketplace/mw/loans/v4/register-start/pl`, body, {
            headers: headers,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error at prefer/start:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/prefr/details", async (req, res) => {
    console.log("Revieved request at /prefr/details");
    const reqBody = req.body;
    const headers = { "Content-Type": "application/json", apikey: apikey };
    try {
        const response = await axios.post(`${host}/marketplace/mw/application/v1/application-details`, reqBody, {
            headers: headers,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error at prefer/details:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/prefr/webview", async (req, res) => {
    console.log("Revieved request at /prefr/webview");
    const { loanId } = req.body;
    const headers = { "Content-Type": "application/json", apikey: apikey };
    try {
        const response = await axios.post(`${host}/marketplace/mw/loans/get-webview`, { loanId }, { headers: headers });
        res.json(response.data);
    } catch (error) {
        console.error("Error at prefer/webview:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/prefr/webhook", async (req, res) => {
    try {
        console.log("Received request at /prefr/webhook");
        const { loanId } = req.body;
        const user = await User.findOne({ "accounts.id": loanId });
        if (!user) return res.status(404).json({ error: "LoanID not found" });
        await User.updateOne(
            { accounts: { $elemMatch: { name: "Prefr", id: loanId } } },
            { $set: { "accounts.$.response": req.body } },
        );
        res.json({ status: "success", id: loanId });
    } catch (err) {
        console.error("Error occurred while processing webhook:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/prefr/start2", async (req, res) => {
    console.log("Revieved request at /prefr/start");
    const body = req.body;
    const { mobileNo } = req.body;
    const user = createUser(mobileNo);
    const headers = {
        "Content-Type": "application/json",
        apikey: apikey,
    };
    const userId = "CMU-" + uuidv4().replace(/-/g, "");
    body["userId"] = userId;
    try {
        const response = await axios.post(`${host}/marketplace/mw/loans/v4/register-start/pl`, body, {
            headers: headers,
        });
        console.log(response.data);
        addToUser(user, { name: "Prefr", id: response.data.data.loanId });
        res.json(response.data);
    } catch (error) {
        console.error("Error at prefer/start:", error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;
