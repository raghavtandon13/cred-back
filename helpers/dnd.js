const mongoose = require("mongoose");
const User = require("../models/user.model");
require("dotenv").config();

// Define a list of numbers
const numbers = [
    "9633545358",
    "7007071365",
    "9908721961",
    "9874586663",
    "6392606308",
    "7992403829",
    "9769122296",
    "9532176998",
    "8123485884",
    "9853802324",
    "7710849595",
    "6005112254",
    "7011376382",
    "6291615331",
    "7425943383",
    "8421518702",
    "7010980427",
    "8178321978",
    "9791479840",
    "8433679960",
    "6383773806",
    "8013530686",
    "7006624530",
    "7003345166",
    "8904762493",
    "9866272013",
    "7012709138",
    "8113886477",
    "8082715453",
    "9821247157",
    "8754141416",
    "7075496263",
    "9900278581",
    "9471273634",
];

async function main() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        mongoose.set("strictQuery", false);
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        for (const number of numbers) {
            const users = await User.find({ phone: number });
            const user = await User.findOne({ phone: number });
            if (user) {
                user.isBanned = true;
                await user.save();
                console.log(number, " : ", users.length, " : ", "found");
                continue;
            } else {
                await User.create({ phone: number, isBanned: true });
                console.log(number, " : ", users.length, " : ", "new");
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
