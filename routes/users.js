const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const mongoose = require("mongoose");

router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: "Invalid user ID" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
