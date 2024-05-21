const express = require("express");
const axios = require("axios");
const router = express.Router();
const fs = require("fs");
const FormData = require("form-data");
const upload = require("../../middlewares/upload");

router.get("/", function (_req, res) {
    res.status(200).json({
        type: "success",
        message: "vitto service is running",
    });
});

const api = "https://apis.vitto.money";

const keys = {
    // "X-Partner-Id": "ceba5f64579232655bd11627ae3f0023",
    // "X-Partner-API-Key": "7ba1d96dfc74f0eed67d351e0f7830d2dae8eb732f47e4e8e4a138143008765b",
    "X-Partner-Id": "ef2a878954a53b99d387d736950937a4",
    "X-Partner-API-Key": "36b19400c4323649c270db3c99c20bb4e32efcf36324842c9462c89a321b66f1",
};

router.post("/register", async function (req, res) {
    const registerRes = await axios.post(`${api}/users/api/v1/ext/register`, req.body, { headers: keys });
    res.json(registerRes.data);
});

router.post("/login", async function (req, res) {
    try {
        const loginRes = await axios.post(`${api}/users/api/v1/ext/login`, req.body, { headers: keys });
        res.json(loginRes.data);
    } catch (error) {
        res.json(error.response.data);
    }
});

router.post("/pan", upload.single("panImage"), async function (req, res) {
    const { token } = req.body;
    const panPath = req.file.path;
    const panFormData = FormData();
    const panStream = fs.createReadStream(panPath);
    panFormData.append("panFront", panStream, { filename: req.file.originalname });
    console.log("f:", panFormData);

    try {
        const panRes = await axios.post(`${api}/users/api/v1/ext/onboard/pan`, panFormData, {
            headers: { Authorization: "Bearer " + token, ...keys, ...panFormData.getHeaders() },
        });
        res.json(panRes.data);
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            res.status(status).json({ error: data });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.post("/update", async function (req, res) {
    const { token } = req.body;
    const updateData = req.body;
    delete updateData.token;
    try {
        const updateRes = await axios.patch(`${api}/users/api/v1/ext/profile`, updateData, {
            headers: { Authorization: "Bearer " + token, ...keys },
        });
        res.json(updateRes.data);
    } catch (error) {
        res.json(error.response.data);
    }
});

router.post("/getdetails", async function (req, res) {
    const { token } = req.body;
    try {
        const getDetailsRes = await axios.get(`${api}/loans/api/v1/loans/ext/fields/HSF/HPL`, {
            headers: { Authorization: "Bearer " + token, ...keys },
        });
        res.json(getDetailsRes.data);
    } catch (error) {
        res.json(error.response.data);
    }
});

router.post("/apply", async function (req, res) {
    const { token } = req.body;
    const applyData = req.body;
    delete applyData.token;
    try {
        const applyRes = await axios.post(`${api}/loans/api/v1/loans/ext/leads`, applyData, {
            headers: { Authorization: "Bearer " + token, ...keys },
        });
        res.json(applyRes.data);
    } catch (error) {
        res.json(error.response.data);
    }
});

module.exports = router;
