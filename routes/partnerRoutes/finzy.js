// Imports
const router = require("express").Router();
const axios = require("axios");

// Routes
router.post("/finzy/echeck", async (req, res) => {
    try {
        const finzyResponse = await axios.post("https://ecs.api.finbuddy.in/in-principle-approval", req.body, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // NOTE : Auth present here in headers
            },
        });
        res.json(finzyResponse);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
