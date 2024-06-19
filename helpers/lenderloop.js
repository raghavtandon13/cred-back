const mongoose = require("mongoose");
const User = require("../models/user.model");
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

function logToFile(message) {
    const today = new Date();
    const logFileName = `${today.getDate()}-${today.toLocaleString("default", { month: "short" })}_log.txt`;
    const logFilePath = path.join(__dirname, logFileName);

    fs.appendFile(logFilePath, message + "\n", (err) => {
        if (err) {
            console.error("Error writing to log file:", err);
        }
    });
}

// const API_URL = "https://credmantra.com/api/v1/leads/inject2";
const API_URL = "http://localhost:3000/api/v1/leads/inject2";
const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log("Connected to MongoDB successfully.");

        let leadFound = true;
        while (leadFound) {
            const leads = await User.find({
                partner: "MoneyTap",
                partnerSent: false,
                isBanned: false,
                employment: "Salaried",
            })
                .sort({ createdAt: -1 })
                .limit(1);

            // $elemMatch: { name: { $ne: "Upwards" } },
            // createdAt: { $gt: new Date("2024-04-05") },

            if (leads.length === 0) {
                console.log("No unsent leads found.");
                leadFound = false;
                process.exit(1);
            }

            const leadPromises = leads.map(async (lead) => {
                try {
                    console.log("Sending lead:", lead.phone);
                    const leadData = {
                        lead: {
                            phone: lead.phone,
                            firstName: lead.name.split(" ")[0],
                            lastName: lead.name.split(" ")[1],
                            dob: lead.dob,
                            email: lead.email,
                            gender: lead.gender.toUpperCase(),
                            city: lead.city,
                            state: lead.state.toUpperCase() || "HARYANA",
                            pincode: lead.pincode,
                            pan: lead.pan,
                            empName: lead.company_name,
                            salary: lead.income,
                            employment: lead.employment,
                        },
                    };

                    console.log(lead.phone);
                    const response = await axios.post(API_URL, leadData, {
                        headers: {
                            "x-api-key": "vs65Cu06K1GB2qSdJejP",
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.status === 200) {
                        // lead.partnerSent = true;
                        // await lead.save();
                        console.log("Response for ", lead.phone, ": ", response.data);
                        logToFile(`Response for ${lead.phone}: ${JSON.stringify(response.data)}`);
                    } else {
                        console.error("Failed to send lead:", response.statusText);
                        logToFile(`Failed to send lead - PAN: ${lead.pan} - Error: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error("Error sending lead:", error.message);
                    logToFile(`Error sending lead - PAN: ${lead.pan} - Error: ${error.message}`);
                }
            });

            await Promise.all(leadPromises);
            leadFound = false;
            process.exit(1);
        }
    } catch (error) {
        console.error("Error:", error.message);
        logToFile(`Error: ${error.message}`);
        process.exit(1);
    }
}

main();
