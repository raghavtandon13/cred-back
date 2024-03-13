// IMPORTS
const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../../models/user.model");

//-------------------------------------------------------------------------------//
// FIBE API------FIBE API------FIBE API------FIBE API------FIBE API------FIBE API//
//-------------------------------------------------------------------------------//

//-------------------------------------------------------------------------------//
// UAT LINKS
// const fibeUrl = "https://uatapi.earlysalary.com/token/esapi/generateTokenNew";
// const profileIngestionUrl = "https://uatapi.earlysalary.com/espiqa/profile-ingestion";
const customerStatusUrl = "https://uatapi.earlysalary.com/hrms/fetchcuststatus";
const numberResetUrl = "https://uatapi.socialworth.in/checkout-qa/escheckout/resetrecordqa";

// Prod LINKS
const fibeUrl = "https://api.socialworth.in/aggext-prod/esapi/generateTokenNew";
const profileIngestionUrl = "https://api.socialworth.in/aggext-prod/esapi/profile-ingestion";
// const customerFetchStatus = "https://api.socialworth.in/aggext-prod/esapi/fetchcuststatus";
//-------------------------------------------------------------------------------//

router.get("/", function (res) {
  res.status(200).json({
    type: "success",
    message: "fibe service is running",
  });
});

router.post("/", async (req, res) => {
  try {
    const requestData = req.body;
    const { mobilenumber } = req.body;

    let user;
    try {
      user = await User.findOne({ phone: mobilenumber });
      if (!user) {
        const newUser = new User({ phone: mobilenumber });
        user = await newUser.save();
      }
    } catch (mongoError) {
      console.error("MongoDB error:", mongoError);
    }

    const response1 = await axios.post(fibeUrl, {
      username: "CredmantraUat",
      password: "CredmantraUat@UAT#27112023",
      applicationName: "APP",
      //
      /////////// Prod keys only on server
      //
      //username: "CredMANTRAPrOd",
      //password: "CredManTraPrOd@05012024!",
      //applicationName: "APP",
    });

    const token = response1.data.token;

    const response2 = await axios.post(profileIngestionUrl, requestData, {
      headers: {
        Token: `${token}`,
      },
    });

    const responseData = response2.data;
    // user.accounts.push({
    //   fibe: {
    //     sent: requestData,
    //     res: responseData,
    //   },
    // });

    try {
      if (user) {
        user.accounts.push({
          fibe: {
            sent: requestData,
            res: responseData,
          },
        });
        await user.save();
        console.log("User data saved successfully.");
      } else {
        console.log("User not found. Skipping saving to user.");
      }
    } catch (mongoError) {
      console.error("MongoDB error:", mongoError);
    }

    res.status(200).json(responseData);
    console.log("whole user data: ", user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/customer-status", async (req, res) => {
  try {
    const requestData = req.body;
    const response = await axios.post(customerStatusUrl, requestData, {
      headers: {
        Authorization: `${token}`,
      },
    });
    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/number-reset", async (req, res) => {
  try {
    const requestData = req.body;
    const response = await axios.post(numberResetUrl, requestData, {
      headers: {
        Authorization: `${token}`,
      },
    });
    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
