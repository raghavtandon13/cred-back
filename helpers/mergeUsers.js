const mongoose = require("mongoose");
const User = require("../models/user.model");
require("dotenv").config();
const prod = true;

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function mergeDuplicateUsers() {
    try {
        const duplicatePhones = await User.aggregate([
            { $group: { _id: "$phone", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } },
            { $project: { _id: 0, phone: "$_id" } },
            { $limit: 10 },
        ]);
        let i = 1;
        for (const { phone } of duplicatePhones) {
            console.log(i++, ": ", phone);
            const users = await User.find({ phone });
            const masterUser = users.reduce((acc, user) => (user.updatedAt > acc.updatedAt ? user : acc));
            const mergedAccounts = users.flatMap((user) => user.accounts);
            await Promise.all(
                users
                    .filter((user) => user !== masterUser)
                    .map((user) => (prod ? User.findByIdAndDelete(user._id) : Promise.resolve())),
            );
            masterUser.accounts = mergedAccounts;
            prod ? await masterUser.save() : console.log("Save skipped");
        }

        console.log("Done");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}
async function countDuplicates() {
    const duplicateCount = await User.aggregate([
        { $group: { _id: "$phone", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
        { $group: { _id: null, duplicatePhones: { $sum: 1 }, totalDuplicates: { $sum: "$count" } } },
    ]);

    console.log("Duplicates Phones:", duplicateCount[0].duplicatePhones);
    console.log("Total Duplicates:", duplicateCount[0].totalDuplicates);
    console.log("Should Delete:", duplicateCount[0].totalDuplicates - duplicateCount[0].duplicatePhones);
    process.exit(1);
}

countDuplicates();
mergeDuplicateUsers();
