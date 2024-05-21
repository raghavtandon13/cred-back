var express = require("express");
var router = express.Router();
var User = require("../models/user.model"); // Adjust the path based on your project structure
var mongoose = require("mongoose");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

/* GET user by ID. */
router.get("/:userId", async function (req, res, next) {
    try {
        const userId = req.params.userId;
        //console.log(`Received request for user ID: ${userId}`);

        // Assuming userId is a valid ObjectId (MongoDB's default _id format)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            //console.log(`Invalid user ID: ${userId}`);
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await User.findById(userId);

        if (!user) {
            //console.log(`User not found for ID: ${userId}`);
            return res.status(404).json({ error: "User not found" });
        }
        //console.log(`User found: ${user}`);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
