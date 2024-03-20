const express = require("express");
const router = express.Router();
const axios = require("axios");
// const User = require("../../models/user.model");

const base_url = "https://dev.moneytap.com";
async function fetchAccessToken() {
  try {
    const client_id = "dsa-creditmantra";
    const client_secret = "saWGY4hF804GeVl";
    const credentials = `${client_id}:${client_secret}`;
    const encodedCredentials = btoa(credentials);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${encodedCredentials}`,
    };

    const response = await axios.post(`${base_url}/oauth/token?grant_type=client_credentials`, null, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    throw new Error("Failed to fetch access token");
  }
}
router.get("/create", async (req, res) => {
  try {
    const data = req.body;
    const { phone } = req.body;

    // let user;
    // try {
    //   user = await User.findOne({ phone: phone });
    // } catch (mongoError) {
    //   console.error("MongoDB error:", mongoError);
    // }

    const accessToken = await fetchAccessToken();
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(`${base_url}/v3/partner/lead/create`, data, { headers });

    // try {
    //   if (user) {
    //     user.accounts.push({
    //       moneytap: {
    //         sent: data,
    //         res: response.data,
    //       },
    //     });
    //     await user.save();
    //     console.log("User data saved successfully.");
    //   } else {
    //     console.log("User not found. Skipping saving to user.");
    //   }
    // } catch (mongoError) {
    // console.error("MongoDB error:", mongoError);
    // }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
});
router.get("/status", async (req, res) => {
  try {
    const { customerId, phone } = req.body;
    // let user;
    // try {
    //   user = await User.findOne({ phone: phone });
    // } catch (mongoError) {
    //   console.error("MongoDB error:", mongoError);
    // }

    const accessToken = await fetchAccessToken();
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(`${base_url}/v3/partner/lead/status`, customerId, { headers });

    // try {
    //   if (user) {
    //     user.accounts.push({
    //       moneytap: {
    //         res: response.data,
    //       },
    //     });
    //     await user.save();
    //     console.log("User data saved successfully.");
    //   } else {
    //     console.log("User not found. Skipping saving to user.");
    //   }
    // } catch (mongoError) {
    //   console.error("MongoDB error:", mongoError);
    // }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
});

module.exports = router;
