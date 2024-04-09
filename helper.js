const mongoose = require("mongoose");
const User = require("./models/user.model"); // Assuming you have a User model
const { response } = require("express");
require("dotenv").config();
const fs = require('fs');

async function main() {
  try {
    const { MONGODB_URI, API_VERSION } = require("./config");
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("Connected to MongoDB successfully.");

    // Display loading indicator
    process.stdout.write("Fetching users...");

    const users = await User.find({ partner: "MoneyTap", createdAt: { $gt: new Date("2024-04-03") } });
    console.log("\nUsers fetched successfully.");
    console.log(`Found ${users.length} users with partner "MoneyTap" and createdAt greater than April 3, 2024.`);

    // Write users to file
    process.stdout.write("Saving users to file...");
    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error("Error saving users to file:", err);
      } else {
        console.log("\nUsers saved to users.json.");
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
