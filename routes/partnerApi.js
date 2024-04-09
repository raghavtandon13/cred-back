// IMPORTS
var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var axios = require("axios");
const fs = require("fs");
const User = require("../models/user.model");
// const CryptoJS = require("crypto-js");
// const User = require("../models/user.model");
// const FormData = require("form-data");
// const path = require("node:path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Multer
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
const casheRouter = require("./partnerRoutes/casheRouter");
const faircentRouter = require("./partnerRoutes/faircentRouter");
// const upwardsRouter = require("./partnerRoutes/upwardsRouter");
const fibeRouter = require("./partnerRoutes/fibeRouter");
// const moneytapRouter = require("./partnerRoutes/moneytapRouter");

// ROUTES
router.use("/faircent", faircentRouter);
router.use("/cashe", casheRouter);
// router.use("/moneytap", moneytapRouter);
// router.use("/upwards", upwardsRouter);
router.use("/fibe", fibeRouter);

// TEST ROUTE
router.get("/", function (res) {
  res.status(200).json({
    type: "success",
    message: "partnerapi service is running",
  });
});

router.post("/test", async (res) => {
  try {
    const sendthis = {
      mobilenumber: "8983657823",
      status: "Rejected",
      statuscode: 200,
      customerid: "1486034765",
    };

    res.status(200).json(sendthis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//---------------------------------------------------------------------------------------------//
// FIBE API------FIBE API------FIBE API------FIBE API------FIBE API------FIBE API--------------//
//---------------------------------------------------------------------------------------------//

// // const fibeUrl = "https://uatapi.earlysalary.com/token/esapi/generateTokenNew";
// // const profileIngestionUrl = "https://uatapi.earlysalary.com/espiqa/profile-ingestion";
// const fibeUrl = "https://api.socialworth.in/aggext-prod/esapi/generateTokenNew";
// const profileIngestionUrl = "https://api.socialworth.in/aggext-prod/esapi/profile-ingestion";
// // const customerFetchStatus = "https://api.socialworth.in/aggext-prod/esapi/fetchcuststatus";
//
// router.post("/fibe", async (req, res) => {
//   try {
//     const requestData = req.body;
//     const { mobilenumber } = req.body;
//
//     const user = await User.findOne({ phone: mobilenumber });
//
//     const response1 = await axios.post(fibeUrl, {
//       username: "CredmantraUat",
//       password: "CredmantraUat@UAT#27112023",
//       applicationName: "APP",
//       //
//       /////////// Prod keys only on server
//       //
//       //username: "CredMANTRAPrOd",
//       //password: "CredManTraPrOd@05012024!",
//       //applicationName: "APP",
//     });
//
//     const token = response1.data.token;
//
//     const response2 = await axios.post(profileIngestionUrl, requestData, {
//       headers: {
//         Token: `${token}`,
//       },
//     });
//
//     const responseData = response2.data;
//     user.accounts.push({
//       fibe: {
//         sent: requestData,
//         res: responseData,
//       },
//     });
//
//     await user.save();
//
//     res.status(200).json(responseData);
//     console.log("whole user data: ", user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });
//
// const customerStatusUrl = "https://uatapi.earlysalary.com/hrms/fetchcuststatus";
//
// router.post("/fibe/customer-status", async (req, res) => {
//   try {
//     const requestData = req.body;
//     const response = await axios.post(customerStatusUrl, requestData, {
//       headers: {
//         Authorization: `${token}`,
//       },
//     });
//     const responseData = response.data;
//     res.status(200).json(responseData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });
//
// const numberResetUrl = "https://uatapi.socialworth.in/checkout-qa/escheckout/resetrecordqa";
//
// router.post("/fibe/number-reset", async (req, res) => {
//   try {
//     const requestData = req.body;
//     const response = await axios.post(numberResetUrl, requestData, {
//       headers: {
//         Authorization: `${token}`,
//       },
//     });
//     const responseData = response.data;
//     res.status(200).json(responseData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

//---------------------------------------------------------------------------------------------//
// FINNABLE API--------FINNABLE API--------FINNABLE API--------FINNABLE API--------FINNABLE API//
//---------------------------------------------------------------------------------------------//

const finnableApiKey = "YOUR_FINNABLE_API_KEY";
const finnableApiUrl = "https://finnable-api-url.com";

router.post("/finnable", async (req, res) => {
  try {
    const { mobileNo } = req.body;
    const timestamp = new Date().toISOString();
    const accessTokenSignature = crypto
      .createHmac("sha256", finnableApiKey)
      .update(`POST/accessToken${timestamp}${accessTokenData}`)
      .digest("hex");
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

      const losApiResponse = await axios.post(losApiUrl, req.body, {
        headers: {
          "API-CLIENT": "MWide",
          "API-KEY": authToken,
        },
      });

      res.json(losApiResponse.data);
    } else {
      res.status(500).json({ error: "Token generation failed" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

//---------------------------------------------------------------------------------------------//
// UPWARDS--------UPWARDS API-------UPWARDS API------UPWARDS API------UPWARDS API------------- //
//---------------------------------------------------------------------------------------------//

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
router.post("/upwards/create", async (req, res) => {
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
//NOTE: req.body should only contain customer_id and loan_id
router.post("/upwards/complete", async (req, res) => {
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
//NOTE: req.body should only contain customer_id and loan_id
router.post("/upwards/decision", async (req, res) => {
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
//NOTE: req.body should only contain customer_id and loan_id
router.post("/upwards/transition", async (req, res) => {
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

// ---------------------------------------------------------------------------------------------//
// CASHE--------CASHE API-------CASHE API------CASHE API------CASHE API--CASHE API-------------//
// ---------------------------------------------------------------------------------------------//

// function generateCheckSum(data, secretKey) {
//   const dataStr = JSON.stringify(data);
//   const encryptedStr = CryptoJS.HmacSHA1(dataStr, secretKey);
//   const checkSumValue = CryptoJS.enc.Base64.stringify(encryptedStr);
//   return checkSumValue;
// }
// router.post("/cashe/checkDuplicateLead", async (req, res) => {
//   try {
//     const { mobile_no, partner_name } = req.body;

//     data = {
//       mobile_no: mobile_no,
//       partner_name: partner_name,
//     };

//     const c1 = generateCheckSum(data, "_bz_q]o2T,#(wM`D");
//     const casheResponse = await axios.post(
//       "https://test-partners.cashe.co.in/partner/checkDuplicateCustomerLead",
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Check-Sum": c1,
//         },
//       },
//     );
//     res.json(casheResponse.data);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// router.post("/cashe/preApproval", async (req, res) => {
//   try {
//     const c2 = generateCheckSum(req.body, "_bz_q]o2T,#(wM`D");
//     const casheDetails = await axios.post(
//       "https://test-partners.cashe.co.in/report/getLoanApprovalDetails",
//       req.body,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Check-Sum": c2,
//         },
//       },
//     );
//     res.json(casheDetails.data);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// router.post("/cashe/createCustomer", async (req, res) => {
//   try {
//     const c3 = generateCheckSum(req.body, "_bz_q]o2T,#(wM`D");
//     const casheCreate = await axios.post(
//       "https://test-partners.cashe.co.in/partner/create_customer",
//       req.body,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Check-Sum": c3,
//         },
//       },
//     );
//     res.json(casheCreate.data);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// router.post("/cashe/salary", async (req, res) => {
//   try {
//     const c4 = generateCheckSum(req.body, "_bz_q]o2T,#(wM`D");
//     const casheSalaryDetails = await axios.post(
//       "https://test-partners.cashe.co.in/partner/fetchCashePlans/salary",
//       req.body,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Check-Sum": c4,
//         },
//       },
//     );
//     res.json(casheSalaryDetails.data);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// router.post("/cashe/status", async (req, res) => {
//   try {
//     const c5 = generateCheckSum(req.body, "_bz_q]o2T,#(wM`D");
//     const casheSalaryDetails = await axios.post(
//       "https://test-partners.cashe.co.in/partner/customer_status",
//       req.body,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Check-Sum": c5,
//         },
//       },
//     );
//     res.json(casheSalaryDetails.data);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// router.post("/cashe/upload", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;
//     const partnerName = req.body.partner_name;
//     const partnerCustomerId = req.body.partner_customer_id;
//     const fileType = req.body.file_type;

//     const formData = new FormData();
//     formData.append("file", file.buffer, { filename: file.originalname });
//     formData.append("partner_name", partnerName);
//     formData.append("partner_customer_id", partnerCustomerId);
//     formData.append("file_type", fileType);

//     const c6 = generateCheckSum(formData, "_bz_q]o2T,#(wM`D");

//     const casheUploadResponse = await axios.post(
//       "https://test-partners.cashe.co.in/partner/document/upload",
//       formData,
//       {
//         headers: {
//           "Content-Type":
//             "multipart/form-data; boundary=<calculated when request is sent>",
//           "Check-Sum": c6,
//         },
//       },
//     );

//     res.json(casheUploadResponse.data);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//---------------------------------------------------------------------------------------------//
// FINZY API----FINZY API-------FINZY API------FINZY API-----FINZY API----FINZY API------------//
//---------------------------------------------------------------------------------------------//

router.post("/finzy/echeck", async (req, res) => {
  try {
    const finzyResponse = await axios.post("https://ecs.api.finbuddy.in/in-principle-approval", req.body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // TODO : Auth present here in headers
      },
    });
    res.json(finzyResponse);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//---------------------------------------------------------------------------------------------//
// LENDINGKART----LENDINGKART------LENDINGKART------LENDINGKART-----LENDINGKART-----LENDINGKART//
//---------------------------------------------------------------------------------------------//

router.post("/lendingkart/lead-exists-status", async (req, res) => {
  try {
    data = req.body;
    const lkResponse = await axios.post(
      "https://lkext.lendingkart.com/admin/lead/v2/partner/leads/lead-exists-status",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "2e067259-5f4a-4ed1-880f-ece8e7b1b9dd",
        },
      },
    );
    res.json(lkResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/lendingkart/p/create-application", async (req, res) => {
  try {
    data = req.body;
    const lkResponse = await axios.post(
      "https://lkext.lendingkart.com/admin/lead/v2/partner/leads/create-application",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "2e067259-5f4a-4ed1-880f-ece8e7b1b9dd",
        },
      },
    );
    res.json(lkResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
router.post("/lendingkart/create-application", async (req, res) => {
  try {
    data = req.body;
    const lkResponse = await axios.post("https://lkext.lendingkart.com/v2/partner/leads/create-application", data, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "2e067259-5f4a-4ed1-880f-ece8e7b1b9dd",
      },
    });
    res.json(lkResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
// upload.single("file"),
router.post("/lendingkart/documents", upload.single("docImage"), async (req, res) => {
  try {
    const { applicationId, documentType } = req.body;
    const docImagePath = req.file.path;
    const fileStream = fs.createReadStream(docImagePath);
    const formData = new FormData();
    formData.append("file", fileStream);

    const url = `https://api.lendingkart.com/v2/partner/leads/documents/${applicationId}/${documentType}`;
    console.log("URL Triggered:", url);

    const lkResponse = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "2e067259-5f4a-4ed1-880f-ece8e7b1b9dd",
      },
    });
    res.json(lkResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
router.post("/lendingkart/magiclink", async (req, res) => {
  try {
    const { applicationId } = req.body;
    const lkResponse = await axios.get(`https://api.lendingkart.com/v2/partner/leads/magic-link/${applicationId}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "2e067259-5f4a-4ed1-880f-ece8e7b1b9dd",
      },
    });
    res.json(lkResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

//---------------------------------------------------------------------------------------------//
// FAIRCENT API----FAIRCENT API-------FAIRCENT API-----FAIRCENT API----FAIRCENT API------------//
//---------------------------------------------------------------------------------------------//

//TODO: Remove console.logs
// router.post("/faircent/dedupe", async (req, res) => {
//   try {
//     console.log("Received request at /faircent/dedupe");
//
//     const data = req.body;
//
//     console.log("Received data from frontend:");
//     console.log("Data:", data);
//
//     const fResponse = await axios.post(
//       "https://fcnode5.faircent.com/v1/api/duplicateCheck",
//       data,
//       {
//         headers: {
//           "x-application-name": "credmantra",
//           "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
//           "Content-Type": "application/json",
//         },
//       },
//     );
//
//     console.log("Received response from third-party API:");
//     console.log("Status:", fResponse.status);
//     console.log("Data:", fResponse.data);
//
//     res.status(200).json(fResponse.data);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// router.post("/faircent/register", async (req, res) => {
//   try {
//     console.log("Received request at /faircent/register");
//
//     const data = req.body;
//
//     console.log("Received data from frontend:");
//     console.log("Data:", data);
//
//     const fResponse = await axios.post(
//       "https://fcnode5.faircent.com/v1/api/aggregrator/register/user",
//       data,
//       {
//         headers: {
//           "x-application-name": "credmantra",
//           "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
//           "Content-Type": "application/json",
//         },
//       },
//     );
//
//     console.log("Received response from third-party API:");
//     console.log("Status:", fResponse.status);
//     console.log("Data:", fResponse.data);
//
//     res.status(200).json(fResponse.data);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// router.post("/faircent/upload", upload.single("docImage"), async (req, res) => {
//   console.log("upload started");
//   console.log("path:", req.file.path);
//   try {
//     console.log("Received request at /faircent/upload");
//     const { loan_id, token, type } = req.body;
//
//     const formData = new FormData();
//     formData.append("type", type);
//     formData.append("loan_id", loan_id);
//     formData.append("docImage", req.file.path);
//
//     console.log("Sending data to third-party API:", formData);
//     const fResponse = await axios.post(
//       "https://fcnode5.faircent.com/v1/api/uploadprocess",
//       formData,
//       {
//         headers: {
//           "x-application-name": "credmantra",
//           "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
//           "x-access-token": token,
//         },
//       },
//     );
//
//     console.log("Received response from third-party API:");
//     console.log("Status:", fResponse.status);
//     console.log("Data:", fResponse.data);
//
//     res.status(200).json(fResponse.data);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//---------------------------------------------------------------------------------------------//
// MONEYVIEW----MONEYVIEW-------MONEYVIEW------MONEYVIEW-----MONEYVIEW----MONEYVIEW------------//
//---------------------------------------------------------------------------------------------//

const getToken = async () => {
  const tokenResponse = await axios.post("https://uat-atlas.whizdm.com/atlas/v1/token", {
    partnerCode: 159,
    userName: "credmantra",
    password: "\"'Z5dJL4kq",
  });

  return tokenResponse.data.token;
};
router.post("/moneyview/create", async (req, res) => {
  try {
    const data = req.body;
    const token = await getToken();
    const response = await axios.post("https://uat-atlas.whizdm.com/atlas/v1/lead", data, {
      headers: {
        token: token,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/moneyview/offers", async (req, res) => {
  try {
    const { leadId } = req.body;
    const token = await getToken();
    const response = await axios.get(`https://uat-atlas.whizdm.com/atlas/v1/offers/${leadId}`, {
      headers: {
        token: token,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/moneyview/status", async (req, res) => {
  try {
    const { leadId } = req.body;
    const token = await getToken();
    const response = await axios.get(`https://uat-atlas.whizdm.com/atlas/v1/lead/status/${leadId}`, {
      headers: {
        token: token,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//---------------------------------------------------------------------------------------------//
// MONEYTAP----MONEYTAP-------MONEYTAP------MONEYTAP-----MONEYTAP----MONEYTAP------------------//
// --------------------------------------------------------------------------------------------//

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
router.post("/moneytap/create", async (req, res) => {
  console.log("Received request at /moneytap/create");
  try {
    const data = req.body;

    const accessToken = await fetchAccessToken();
    console.log("Access Token:", accessToken);
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(`${base_url}/v3/partner/lead/create`, data, { headers });

    res.json(response.data);
  } catch (error) {
    console.error("Error at create endpoint:", error.message);
    res.status(500).json({ error: error });
  }
});
router.post("/moneytap/status", async (req, res) => {
  try {
    const { customerId } = req.body;
    const accessToken = await fetchAccessToken();
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(`${base_url}/v3/partner/lead/status`, { customerId: customerId }, { headers });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
});

//---------------------------------------------------------------------------------------------//
// PREFR--------PREFR-----------PREFR----------PREFR---------PREFR--------PREFR----------------//
// --------------------------------------------------------------------------------------------//

const host = "https://phoenix-uat.creditvidya.com";
const apikey = "c3f22da6a999b8ddf13b1c24d960444e";
router.post("/prefr/dedupe", async (req, res) => {
  console.log("Revieved request at /prefr/dedupe");
  const body = req.body;

  const headers = {
    "Content-Type": "application/json",
    apikey: apikey,
  };

  const requestId = "CM-" + uuidv4().replace(/-/g, "");
  body[requestId] = requestId;

  try {
    const response = await axios.post(`${host}/marketplace/mw/loans/v2/dedupe-service`, body, { headers: headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error at prefer/dedupe:", error.message);
    res.status(error.response.status).json({ error: error.response.data });
  }
});

router.post("/prefr/start", async (req, res) => {
  console.log("Revieved request at /prefr/start");
  const body = req.body;
  const { mobileNo } = req.body;

  let user;
  try {
    user = await User.findOne({ phone: mobileNo });
    if (!user) {
      console.log("creating");
      const newUser = new User({ phone: mobileNo });
      user = await newUser.save();
      console.log("User created successfully:", user);
    }
  } catch (mongoError) {
    console.error("MongoDB error:", mongoError);
  }

  if (!user.accounts) {
    console.log("Initializing accounts array...");
    user.accounts = [];
    await user.save();
  }
  const headers = {
    "Content-Type": "application/json",
    apikey: apikey,
  };
  const userId = "CMU-" + uuidv4().replace(/-/g, "");
  body[userId] = userId;

  try {
    const response = await axios.post(`${host}/marketplace/mw/loans/v4/register-start/pl`, body, {
      headers: headers,
    });
    const prefrAccountData = {
      name: "Prefr",
      id: response.data.data.loanId,
    };

    const prefrAccountIndex = user.accounts.findIndex((account) => account.name === "Prefr");
    if (prefrAccountIndex !== -1) {
      user.accounts[prefrAccountIndex] = prefrAccountData;
      console.log("found index", prefrAccountIndex);
    } else {
      user.accounts.push(prefrAccountData);
      console.log("pushing...");
    }
    await user.save();
    res.json(response.data);
  } catch (error) {
    console.error("Error at prefer/start:", error.message);
    res.status(error.response.status).json({ error: error.response.data });
  }
});

router.post("/prefr/details", async (req, res) => {
  console.log("Revieved request at /prefr/details");
  const reqBody = req.body;

  const headers = {
    "Content-Type": "application/json",
    apikey: apikey,
  };

  try {
    const response = await axios.post(`${host}/marketplace/mw/application/v1/application-details`, reqBody, {
      headers: headers,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error at prefer/details:", error.message);
    res.status(error.response.status).json({ error: error.response.data });
  }
});

router.post("/prefr/webview", async (req, res) => {
  console.log("Revieved request at /prefr/webview");
  const { loanId } = req.body;

  const headers = {
    "Content-Type": "application/json",
    apikey: apikey,
  };
  try {
    const response = await axios.post(`${host}/marketplace/mw/loans/get-webview`, { loanId }, { headers: headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error at prefer/webview:", error.message);
    res.status(error.response.status).json({ error: error.response.data });
  }
});

router.post("/prefr/webhook", async (req, res) => {
  try {
    console.log("Received request at /prefr/webhook");
    const { loanId } = req.body;

    const user = await User.findOne({ "accounts.id": loanId });

    if (!user) {
      return res.status(404).json({ error: "LoanID not found" });
    }
    await User.updateOne(
      { accounts: { $elemMatch: { name: "Prefr", id: loanId } } },
      { $set: { "accounts.$.response": req.body } },
    );

    res.json({ status: "success", id: loanId });
  } catch (err) {
    console.error("Error occurred while processing webhook:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
