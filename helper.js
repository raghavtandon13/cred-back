const mongoose = require("mongoose");
const User = require("./models/user.model"); // Assuming you have a User model
require("dotenv").config();

async function main() {
  const { MONGODB_URI, API_VERSION } = require("./config");
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("Database connected, running on 3000...");

    // Find the user with phone number "8094634634"
    const user = await User.findOne({ phone: "8094634634" });

    if (user) {
      console.log("User found:", user);

      // Generate random JSON data for requestData and responseData
      const requestData = { example: "data" };
      const responseData = {
        mobilenumber: "8983657823",
        status: "Rejected",
        statuscode: 200,
        customerid: "1486034765",
        reason: "customer lead created",
        sanctionLimit: 0.0,
        responseDate: "2023-02-27 13:05:18",
        esRefId: "27958055oapwwd",
        inPrincipleLimit: 0,
        inPrincipleTenure: 0,
        customerType: "A7",
        redirectionUrl: "https://portal-qa.fibe.in/es-landing?sso=61jcY2RSd7tYJos20230712062033",
      };

      // Push data to user's accounts
      user.accounts.push({
        name: "Fibe",
        url: responseData.redirectionUrl,
        loanAmount: Math.max(responseData.sanctionLimit, responseData.inPrincipleLimit),
        status: responseData.status,
        id: responseData.customerid,
        sent: requestData,
        res: responseData,
      });

      // Save the user
      await user.save();

      console.log("Data pushed to user's accounts:", user.accounts);
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
