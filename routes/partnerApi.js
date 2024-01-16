//#region IMPORTS
var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var axios = require("axios");
const multer = require("multer");
const fs = require("fs");
const upload = multer();
const CryptoJS = require("crypto-js");
const _ = require("lodash");
//#endregion

//#region TEST
//----------//
//---Test---//
//----------//
router.get("/", function (req, res, next) {
  res.status(200).json({
    type: "success",
    message: "partnerapi service is running",
  });
});

router.post("/test", async (req, res) => {
  try {
    console.log(req.body);
    const sendthis = {
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

    res.status(200).json(sendthis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});
//#endregion

//#region FIBE
//-------------------------------------------------------------------------------//
// FIBE API------FIBE API------FIBE API------FIBE API------FIBE API------FIBE API//
//-------------------------------------------------------------------------------//

// const fibeUrl = "https://uatapi.earlysalary.com/token/esapi/generateTokenNew";
// const profileIngestionUrl = "https://uatapi.earlysalary.com/espiqa/profile-ingestion";
const fibeUrl = "https://api.socialworth.in/aggext-prod/esapi/generateTokenNew";
const profileIngestionUrl = "https://api.socialworth.in/aggext-prod/esapi/profile-ingestion";
const customerFetchStatus = "https://api.socialworth.in/aggext-prod/esapi/fetchcuststatus";

router.post("/fibe", async (req, res) => {
  try {
    const requestData = req.body;
    // const { mobilenumber } = req.body;
    console.log(requestData);

    const response1 = await axios.post(fibeUrl, {
      // username: "CredmantraUat",
      // password: "CredmantraUat@UAT#27112023",
      // applicationName: "APP",
      // Prod keys only on server
      username: "CredMANTRAPrOd",
      password: "CredManTraPrOd@05012024!",
      applicationName: "APP",
    });

    const token = response1.data.token;
    console.log("this is token : ", token);

    const response2 = await axios.post(profileIngestionUrl, requestData, {
      headers: {
        Token: `${token}`,
      },
    });

    const responseData = response2.data;
    console.log(responseData);

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Customer Status API
const customerStatusUrl = "https://uatapi.earlysalary.com/hrms/fetchcuststatus";

router.post("/fibe/customer-status", async (req, res) => {
  try {
    const requestData = req.body;
    const response = await axios.post(customerStatusUrl, requestData, {
      headers: {
        Authorization: `${token}`, // You need to obtain a token for this request as well
      },
    });
    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Number Reset API
const numberResetUrl = "https://uatapi.socialworth.in/checkout-qa/escheckout/resetrecordqa";

router.post("/fibe/number-reset", async (req, res) => {
  try {
    const requestData = req.body;
    const response = await axios.post(numberResetUrl, requestData, {
      headers: {
        Authorization: `${token}`, // You need to obtain a token for this request as well
      },
    });
    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});
//#endregion

//#region FINNABLE
//---------------------------------------------------------------------------------------------//
// FINNABLE API--------FINNABLE API--------FINNABLE API--------FINNABLE API--------FINNABLE API//
//---------------------------------------------------------------------------------------------//

const finnableApiKey = "YOUR_FINNABLE_API_KEY";
const finnableApiUrl = "https://finnable-api-url.com";

router.post("/finnable", async (req, res) => {
  // Step 1
  try {
    const { mobileNo } = req.body;
    const timestamp = new Date().toISOString();
    const accessTokenSignature = crypto.createHmac("sha256", finnableApiKey).update(`POST/accessToken${timestamp}${accessTokenData}`).digest("hex");
    const accessTokenHeaders = {
      "finnable-api-key": finnableApiKey,
      "Content-Type": "application/json",
      "finnable-access-timestamp": timestamp,
      "finnable-api-signature": accessTokenSignature,
    };
    const accessTokenResponse = await axios.post(`${finnableApiUrl}/accessToken?mobileNo=${mobileNo}`, {
      headers: accessTokenHeaders,
    });
    const finnableAccessToken = accessTokenResponse.data.accessToken;
    // Step 2
    const sanctionData = req.body;
    delete sanctionData.mobileNo;
    const sanctionHeaders = {
      "finnable-access-token": finnableAccessToken,
      "Content-Type": "application/json",
    };
    const sanctionResponse = await axios.post(`${finnableApiUrl}/sanction`, sanctionData, {
      headers: sanctionHeaders,
    });
    const sanctionDecision = sanctionResponse.data;
    res.json({ sanctionDecision });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "An error occurred while processing the Finnable request.",
    });
  }
});
//#endregion

//#region MONEYWIDE
//---------------------------------------------------------------------------------------------//
//---MONEY WIDE----------MONEY WIDE----------MONEY WIDE----------MONEY WIDE----------MONEY WIDE//
//---------------------------------------------------------------------------------------------//
const tokenApiUrl = "https://deployapigateway.moneywide.com/token";
const tokenApiCredentials = {
  client_id: "MWide",
  client_key: "hsdfgh*&^&dgdhg87",
  source: "MWide",
};

const losApiUrl = "https://deployapigateway.moneywide.com/api/connectorapi-updated-flow";

let authToken = "";

router.post("/moneywide", async (req, res) => {
  try {
    const tokenResponse = await axios.post(tokenApiUrl, tokenApiCredentials);

    if (tokenResponse.data.status === "1") {
      authToken = tokenResponse.data.token;

      const losApiResponse = await axios.post(
        losApiUrl,
        req.body, // Using body data for LOS Push API request
        {
          headers: {
            "API-CLIENT": "MWide",
            "API-KEY": authToken,
          },
        }
      );

      res.json(losApiResponse.data);
    } else {
      res.status(500).json({ error: "Token generation failed" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});
//#endregion

//#region LENDINGKART
//--------------------------------------------------------------------------------//
// LendingKart API------LendingKart API------LendingKart API------LendingKart API //
// leadExists===false
//--------------------------------------------------------------------------------//
const LK_Key = "your_api_key_here";

// Define the base URL for Lendingkart API
const lendingkartBaseUrl = "https://api.lendingkart.com/v2/partner/leads";

router.post("/lendingkart", async (req, res) => {
  // Extract mobile and email from the request body
  const { mobile, email, ...otherData } = req.body;

  // Step 1: Check if the user exists
  try {
    const existsResponse = await axios.post(
      `${lendingkartBaseUrl}/lead-exists-status`,
      { mobile, email },
      {
        headers: { "X-Api-Key": LK_Key },
      }
    );

    if (existsResponse.data === false) {
      // Step 2: User doesn't exist, proceed to create a new application
      try {
        const createResponse = await axios.post(
          `${lendingkartBaseUrl}/create-application`,
          { mobile, email, ...otherData },
          {
            headers: { "X-Api-Key": LK_Key },
          }
        );

        // Assuming Lendingkart responds with some confirmation data
        res.json({
          message: "Application created successfully",
          data: createResponse.data,
        });
      } catch (error) {
        console.error("Error creating application:", error);
        res.status(500).json({ error: "Failed to create application" });
      }
    } else {
      // User already exists
      res.status(400).json({ error: "User already exists" });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Failed to check user existence" });
  }
});

router.get("/lendingkart-status/:applicationId", async (req, res) => {
  const { applicationId } = req.params;

  try {
    const response = await axios.get(`${lendingkartBaseUrl}/applicationStatus/${applicationId}`, {
      headers: { "X-Api-Key": apiKey },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error checking application status:", error);
    res.status(500).json({ error: "Failed to check application status" });
  }
});
//#endregion

//#region UPWARDS
//--------------------------------------------------------------------------------//
// UPWARDS--------UPWARDS API-------UPWARDS API------UPWARDS API------UPWARDS API //
//--------------------------------------------------------------------------------//

// Define the route for affiliate user authentication
router.post("/upwards/eligibility", async (req, res) => {
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
    console.log("eli req:", loanEligibilityRequest);
    const eligibilityResponse = await axios.post("https://uat1.upwards.in/af/v1/customer/loan/eligibility/", loanEligibilityRequest, {
      headers,
    });
    console.log("eli res:", eligibilityResponse.data);
    res.json(eligibilityResponse.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
router.post("/upwards/create", async (req, res) => {
  try {
    const affiliatedUserId = 73;
    const affiliatedUserSecret = "1sMbh5oAXgmT24aB127do6pLWpsMchS3";

    const response = await axios.post("https://uat1.upwards.in/af/v1/authenticate/", {
      affiliated_user_id: affiliatedUserId,
      affiliated_user_secret: affiliatedUserSecret,
    });

    if (response.data && response.data.affiliated_user_session_token) {
      const affiliated_user_session_token = response.data.affiliated_user_session_token;

      // Store the token
      const headers = {
        "Affiliated-User-Id": affiliatedUserId,
        "Affiliated-User-Session-Token": affiliated_user_session_token,
      };

      // Request Data
      const loanDataRequest = req.body;

      const loanDataResponse = await axios.post("https://uat1.upwards.in/af/v2/customer/loan/data", loanDataRequest, {
        headers,
      });
      res.json(loanDataResponse.data);
    } else {
      res.json({ error: "Failed to authenticate" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
router.post("/upwards/transition", async (req, res) => {
  //NOTE: req.body should only contain customer_id and loan_id
  try {
    const affiliatedUserId = 73;
    const affiliatedUserSecret = "1sMbh5oAXgmT24aB127do6pLWpsMchS3";

    const response = await axios.post("https://uat1.upwards.in/af/v1/authenticate/", {
      affiliated_user_id: affiliatedUserId,
      affiliated_user_secret: affiliatedUserSecret,
    });

    if (response.data && response.data.affiliated_user_session_token) {
      const affiliated_user_session_token = response.data.affiliated_user_session_token;

      // Store the token
      const headers = {
        "Affiliated-User-Id": affiliatedUserId,
        "Affiliated-User-Session-Token": affiliated_user_session_token,
      };

      // Request Data
      const transitionRequest = req.body;

      const transitionResponse = await axios.post("https://uat1.upwards.in/af/v2/customer/loan/transition_data/", transitionRequest, {
        headers,
      });
      res.json(transitionResponse.data);
    } else {
      res.json({ error: "Failed to authenticate" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
//#endregion

//#region CASHE
//----------------------------------------------------------------------------------//
// CASHE--------CASHE API-------CASHE API------CASHE API------CASHE API--CASHE API- //
//----------------------------------------------------------------------------------//

function generateCheckSum(data, secretKey) {
  const dataStr = JSON.stringify(data);
  const encryptedStr = CryptoJS.HmacSHA1(dataStr, secretKey);
  const checkSumValue = CryptoJS.enc.Base64.stringify(encryptedStr);
  console.log(checkSumValue);
  return checkSumValue;
}

router.post("/cashe/checkDuplicateLead", async (req, res) => {
  try {
    // const data = req.body;
    const { mobile_no, partner_name } = req.body;

    data = {
      mobile_no: mobile_no,
      partner_name: partner_name,
    };

    console.log(data);
    const c1 = generateCheckSum(data, "_bz_q]o2T,#(wM`D");
    const casheResponse = await axios.post("https://test-partners.cashe.co.in/partner/checkDuplicateCustomerLead", data, {
      headers: {
        "Content-Type": "application/json",
        "Check-Sum": c1,
      },
    });
    res.json(casheResponse.data);
    console.log(casheResponse);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/cashe/preApproval", async (req, res) => {
  try {
    console.log("Recieved: ", req.body);
    const c2 = generateCheckSum(req.body, "_bz_q]o2T,#(wM`D");
    const casheDetails = await axios.post("https://test-partners.cashe.co.in/report/getLoanApprovalDetails", req.body, {
      headers: {
        "Content-Type": "application/json",
        "Check-Sum": c2,
      },
    });
    console.log(casheDetails.data);
    res.json(casheDetails.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/cashe/createCustomer", async (req, res) => {
  try {
    const c3 = generateCheckSum(req.body, "_bz_q]o2T,#(wM`D");
    const casheCreate = await axios.post("https://test-partners.cashe.co.in/partner/create_customer", req.body, {
      headers: {
        "Content-Type": "application/json",
        "Check-Sum": c3,
      },
    });
    res.json(casheCreate.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/cashe/salary", async (req, res) => {
  try {
    const c4 = generateCheckSum(req.body, "_bz_q]o2T,#(wM`D");
    const casheSalaryDetails = await axios.post("https://test-partners.cashe.co.in/partner/fetchCashePlans/salary", req.body, {
      headers: {
        "Content-Type": "application/json",
        "Check-Sum": c4,
      },
    });
    res.json(casheSalaryDetails.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/cashe/status", async (req, res) => {
  try {
    const c5 = generateCheckSum(req.body, "_bz_q]o2T,#(wM`D");
    const casheSalaryDetails = await axios.post("https://test-partners.cashe.co.in/partner/customer_status", req.body, {
      headers: {
        "Content-Type": "application/json",
        "Check-Sum": c5,
      },
    });
    res.json(casheSalaryDetails.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/cashe/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const partnerName = req.body.partner_name;
    const partnerCustomerId = req.body.partner_customer_id;
    const fileType = req.body.file_type;

    const formData = new FormData();
    formData.append("file", file.buffer, { filename: file.originalname });
    formData.append("partner_name", partnerName);
    formData.append("partner_customer_id", partnerCustomerId);
    formData.append("file_type", fileType);

    const c6 = generateCheckSum(formData, "_bz_q]o2T,#(wM`D");

    const casheUploadResponse = await axios.post("https://test-partners.cashe.co.in/partner/document/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
        "Check-Sum": c6,
      },
    });

    res.json(casheUploadResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//#endregion

//#region FINZY
//----------------------------------------------------------------------------------//
// FINZY API----FINZY API-------FINZY API------FINZY API-----FINZY API----FINZY API //
//----------------------------------------------------------------------------------//

router.post("/finzy/echeck", async (req, res) => {
  try {
    const finzyResponse = await axios.post("https://ecs.api.finbuddy.in/in-principle-approval", req.body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // TO-DO : Auth present here in headers
      },
    });
    res.json(finzyResponse);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//#endregion FINZY

//#region LENDINGKART
//----------------------------------------------------------------------------------------------//
// LENDINGKART----LENDINGKART-------LENDINGKART------LENDINGKART-----LENDINGKART----LENDINGKART //
//----------------------------------------------------------------------------------------------//
router.post("/lendingkart/lead-exists-status", async (req, res) => {
  try {
    data = req.body;
    const lkResponse = await axios.post("https://api.lendingkart.com/v2/partner/leads/lead-exists-status", data, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "aaaa-bbbb-cccc-dddd",
      },
    });
    res.json(lkResponse.data);
    console.log(lkResponse);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/lendingkart/create-application", async (req, res) => {
  try {
    data = req.body;
    const lkResponse = await axios.post("https://api.lendingkart.com/v2/partner/leads/create-application", data, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "aaaa-bbbb-cccc-dddd",
      },
    });
    res.json(lkResponse.data);
    console.log(lkResponse);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/lendingkart/documents", async (req, res) => {
  try {
    data = req.body;
    const lkResponse = await axios.post("https://api.lendingkart.com/​v2/partner/leads/documents/{applicationId}/{documentType}", data, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "aaaa-bbbb-cccc-dddd",
      },
    });
    res.json(lkResponse.data);
    console.log(lkResponse);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//#endregion LENDINGKART

//#region FAIRCENT
//----------------------------------------------------------------------------------//
// FAIRCENT API----FAIRCENT API-------FAIRCENT API-----FAIRCENT API----FAIRCENT API //
//----------------------------------------------------------------------------------//
router.post("/faircent/dedupe", async (req, res) => {
  try {
    const data = req.body;
    console.log("Dedupe Data Recieved:", data);
    const fResponse = await axios.post("https://fcnode5.faircent.com/v1/api/duplicateCheck", data, {
      headers: {
        "x-application-name": "credmantra",
        "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
      },
    });
    res.json(fResponse.data);
    console.log(fResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/faircent/register", async (req, res) => {
  try {
    const data = req.body;
    console.log("main data", data);
    const fResponse = await axios.post("https://fcnode5.faircent.com/v1/api/aggregrator/register/user", data, {
      headers: {
        "x-application-name": "credmantra",
        "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
      },
    });
    res.json(fResponse.data);
    console.log(fResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/faircent/upload", upload.single("file"), async (req, res) => {
  res.status(200).json({
    type: "success",
    message: "partnerapi service is running",
  });
});
router.post("/faircent/upload", async (req, res) => {
  try {
    const { token } = req.body;
    const data = req.body;

    const fResponse = await axios.post("/v1/api/uploadprocess", data, {
      headers: {
        "x-application-name": "credmantra",
        "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
        "x-access-token": token,
      },
    });
    res.json(fResponse.data);
    console.log(fResponse.data);
    res.status(200).json({ wow: "done" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//#endregion FAIRCENT

module.exports = router;
