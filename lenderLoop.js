const mongoose = require("mongoose");
const User = require("./models/user.model");
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

// Function to log success and error messages to a log file
function logToFile(message) {
  fs.appendFile("log.txt", message + "\n", (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
}

async function main() {
  try {
    const { MONGODB_URI, API_ENDPOINT_URL } = require("./config");
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("Connected to MongoDB successfully.");

    let leadFound = true;

    while (leadFound) {
      const lead = await User.findOne({
        partner: "MoneyTap",
        partnerSent: false,
        createdAt: { $gt: new Date("2024-04-05") },
      }).sort({ createdAt: 1 });

      if (lead && lead.accounts.filter((account) => account.name === "Fibe").length > 0) {
        console.log(lead.phone, " already sent");
        lead.partnerSent = true;
        await lead.save();
      }

      if (lead) {
        const leadData = {
          lead: {
            phone: lead.phone,
            firstName: lead.name.split(" ")[0],
            lastName: lead.name.split(" ")[1],
            dob: lead.dob,
            email: lead.email,
            gender: lead.gender.toUpperCase(),
            city: lead.city,
            state: lead.state.toUpperCase(),
            pincode: lead.pincode,
            pan: lead.pan,
            empName: lead.company_name,
            salary: lead.income,
          },
        };

        try {
          // const response = await axios.post("https://credmantra.com/api/v1/leads/inject2", leadData, {
          const response = await axios.post("http://localhost:3000/api/v1/leads/inject2", leadData, {
            headers: {
              "x-api-key": "vs65Cu06K1GB2qSdJejP", // Add the x-api-key header
              "Content-Type": "application/json",
            },
          });
          if (response.status === 200) {
            // lead.partnerSent = true;
            await lead.save();
            console.log("Response for ", lead.phone, ": ", response.data);
            logToFile(`Response for ${lead.phone}: ${JSON.stringify(response.data)}`);
          } else {
            console.error("Failed to send lead:", error);
            logToFile(`Failed to send lead - PAN: ${lead.pan} - Error: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Error sending lead:", error.message);
          logToFile(`Error sending lead - PAN: ${lead.pan} - Error: ${error.message}`);
        }
      } else {
        console.log("No unsent leads found.");
        leadFound = false;
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    logToFile(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
