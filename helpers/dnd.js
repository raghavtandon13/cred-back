const mongoose = require("mongoose");
const User = require("../models/user.model");
require("dotenv").config();

// Define a list of numbers
const numbers = ["9633545358", "7007071365", "9908721961", "9874586663", "6392606308", "7992403829", "9769122296"];

async function main() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        mongoose.set("strictQuery", false);
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        for (const number of numbers) {
            const user = await User.findOne({ phone: number });
            if (user) {
                user.isBanned = true;
                await user.save();
                console.log(user);
                continue;
            } else {
                const user1 = await User.create({ phone: number, isBanned: true });
                console.log(user1);
            }
        }

        console.log("DND DONE");

        // You can add further logic here if needed

        process.exit(0); // Exit with success
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1); // Exit with error
    }
}

main();
