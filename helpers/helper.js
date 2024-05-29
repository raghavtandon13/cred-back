const mongoose = require("mongoose");
const User = require("../models/user.model");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function totalCount() {
    const countMoneyTapEntries = await User.countDocuments({ partner: "MoneyTap" });
    const moneyTapEntriesFalse = await User.countDocuments({ partner: "MoneyTap", partnerSent: false });
    const moneyTapEntriesTrue = await User.countDocuments({ partner: "MoneyTap", partnerSent: true });
    const notBanned = await User.countDocuments({
        partner: "MoneyTap",
        partnerSent: false,
        $or: [{ isBanned: false }, { isBanned: { $exists: false } }],
    });

    console.log("MoneyTap Total: ", countMoneyTapEntries);
    console.log("MoneyTap Sent: ", moneyTapEntriesTrue);
    console.log("MoneyTap Pending: ", moneyTapEntriesFalse);
    console.log("MoneyTap notBanned: ", notBanned);
}

async function fibeCount() {
    const count = await User.countDocuments({ accounts: { $elemMatch: { name: "Fibe" } } });
    const count1 = await User.countDocuments({ accounts: { $elemMatch: { name: "Fibe", sent: { $exists: true } } } });
    console.log(count);
    console.log(count1);
    process.exit(1);
}

async function fibeClean() {
    try {
        const users = await User.find(
            { accounts: { $elemMatch: { name: "Fibe", sent: { $exists: true } } } },
            { _id: 1, phone: 1, accounts: 1 },
        ).limit(1);

        if (users.length === 0) {
            console.log("No users with 'Fibe' in accounts found.");
            process.exit(0);
        }

        const bulkOps = users.map((user) => ({
            updateOne: {
                filter: { _id: user._id },
                update: { $unset: { "accounts.$[elem].sent": "" } },
                arrayFilters: [{ "elem.name": "Fibe" }],
            },
        }));

        const result = await User.bulkWrite(bulkOps);
        console.log(`${result.modifiedCount} users updated successfully.`);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

// fibeCount();
// fibeClean();
totalCount();
