// Imports
const router = require("express").Router();
const axios = require("axios");
const { createUser, addToUser, updateUser } = require("../../middlewares/createUser");

// Routes
const getToken = async () => {
    const tokenResponse = await axios.post("https://atlas.whizdm.com/atlas/v1/token", {
        partnerCode: 158,
        userName: "credmantra",
        // password: "mN*y4jsD3,",
        password: "p-wWj6.13M",
    });
    return tokenResponse.data.token;
};

router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const user = await createUser(data.phone);
        // data["partnerCode"] = 172;
        // data["partnerRef"] = "cm_9985718";
        data["partnerCode"] = 158;
        data["partnerRef"] = "cm_9985718";

        const token = await getToken();
        const response = await axios.post("https://atlas.whizdm.com/atlas/v1/lead", data, {
            headers: {
                token: token,
            },
        });

        await addToUser(user, { name: "MoneyView", id: response.data.leadId });
        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/offers", async (req, res) => {
    try {
        const { leadId, phone } = req.body;
        const token = await getToken();
        const response = await axios.get(`https://atlas.whizdm.com/atlas/v1/offers/${leadId}`, {
            headers: { token: token },
        });

        const user = await createUser(phone);
        await updateUser(user, {
            name: "MoneyView",
            message: response.data.message,
            offers: response.data.offerObjects,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/journey", async (req, res) => {
    try {
        const { leadId, phone } = req.body;
        const token = await getToken();
        const response = await axios.get(`https://atlas.whizdm.com/atlas/v1/journey-url/${leadId}`, {
            headers: { token: token },
        });

        const user = await createUser(phone);
        await updateUser(user, {
            name: "MoneyView",
            message: response.data.message,
            link: response.data.pwa,
            ttl: response.data.ttl,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/status", async (req, res) => {
    try {
        const { leadId } = req.body;
        const token = await getToken();
        const response = await axios.get(`https://uat-atlas.whizdm.com/atlas/v1/lead/status/${leadId}`, {
            headers: { token: token },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
