// IMPORTS
var express = require("express");
var router = express.Router();
var axios = require("axios");

//--------------------------------------------------------------------------------//
// UPWARDS--------UPWARDS API-------UPWARDS API------UPWARDS API------UPWARDS API //
//--------------------------------------------------------------------------------//

router.post("/eligibility", async (req, res) => {
  try {
    const affiliatedUserId = 73;
    const affiliatedUserSecret = "1sMbh5oAXgmT24aB127do6pLWpsMchS3";

    const response = await axios.post("https://uat1.upwards.in/af/v1/authenticate/", {
      affiliated_user_id: affiliatedUserId,
      affiliated_user_secret: affiliatedUserSecret,
    });
    let headers = {};
    if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
      headers = {
        "Affiliated-User-Id": affiliatedUserId,
        "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
      };
    } else {
      console.error("affiliated_user_session_token not found in the response data.");
    }

    const loanEligibilityRequest = req.body;
    const eligibilityResponse = await axios.post(
      "https://uat1.upwards.in/af/v1/customer/loan/eligibility/",
      loanEligibilityRequest,
      {
        headers,
      },
    );
    res.json(eligibilityResponse.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const affiliatedUserId = 73;
    const affiliatedUserSecret = "1sMbh5oAXgmT24aB127do6pLWpsMchS3";

    const response = await axios.post("https://uat1.upwards.in/af/v1/authenticate/", {
      affiliated_user_id: affiliatedUserId,
      affiliated_user_secret: affiliatedUserSecret,
    });
    let headers = {};
    if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
      headers = {
        "Affiliated-User-Id": affiliatedUserId,
        "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
      };
    } else {
      console.error("affiliated_user_session_token not found in the response data.");
    }

    const loanDataRequest = req.body;

    const loanDataResponse = await axios.post(
      "https://uat1.upwards.in/af/v2/customer/loan/data/create/",
      loanDataRequest,
      {
        headers,
      },
    );
    res.json(loanDataResponse.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/complete", async (req, res) => {
  try {
    const affiliatedUserId = 73;
    const affiliatedUserSecret = "1sMbh5oAXgmT24aB127do6pLWpsMchS3";

    const response = await axios.post("https://uat1.upwards.in/af/v1/authenticate/", {
      affiliated_user_id: affiliatedUserId,
      affiliated_user_secret: affiliatedUserSecret,
    });

    let headers = {};
    if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
      headers = {
        "Affiliated-User-Id": affiliatedUserId,
        "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
      };
    } else {
      console.error("affiliated_user_session_token not found in the response data.");
    }

    const completeRequest = req.body;

    const completeResponse = await axios.post(
      "https://uat1.upwards.in/af/v2/customer/loan/data/complete/",
      completeRequest,
      {
        headers,
      },
    );
    res.json(completeResponse.data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/decision", async (req, res) => {
  try {
    const affiliatedUserId = 73;
    const affiliatedUserSecret = "1sMbh5oAXgmT24aB127do6pLWpsMchS3";

    const response = await axios.post("https://uat1.upwards.in/af/v1/authenticate/", {
      affiliated_user_id: affiliatedUserId,
      affiliated_user_secret: affiliatedUserSecret,
    });

    let headers = {};
    if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
      headers = {
        "Affiliated-User-Id": affiliatedUserId,
        "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
      };
    } else {
      console.error("affiliated_user_session_token not found in the response data.");
    }

    const decisionRequest = req.body;

    const decisionResponse = await axios.post(
      "https://uat1.upwards.in/af/v2/customer/loan/credit_programs/decision/",
      decisionRequest,
      {
        headers,
      },
    );
    res.json(decisionResponse.data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/transition", async (req, res) => {
  try {
    const affiliatedUserId = 73;
    const affiliatedUserSecret = "1sMbh5oAXgmT24aB127do6pLWpsMchS3";

    const response = await axios.post("https://uat1.upwards.in/af/v1/authenticate/", {
      affiliated_user_id: affiliatedUserId,
      affiliated_user_secret: affiliatedUserSecret,
    });

    let headers = {};
    if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
      headers = {
        "Affiliated-User-Id": affiliatedUserId,
        "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
      };
    } else {
      console.error("affiliated_user_session_token not found in the response data.");
    }

    const transitionRequest = req.body;

    const transitionResponse = await axios.post(
      "https://uat1.upwards.in/af/v2/customer/loan/transition_data/",
      transitionRequest,
      {
        headers,
      },
    );
    res.json(transitionResponse.data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
