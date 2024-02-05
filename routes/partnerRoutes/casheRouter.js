// IMPORTS
var express = require("express");
var router = express.Router();
var axios = require("axios");
const CryptoJS = require("crypto-js");
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");

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

//----------------------------------------------------------------------------------//
// CASHE--------CASHE API-------CASHE API------CASHE API------CASHE API--CASHE API- //
//----------------------------------------------------------------------------------//

function generateCheckSum(data, secretKey) {
  const dataStr = JSON.stringify(data);
  const encryptedStr = CryptoJS.HmacSHA1(dataStr, secretKey);
  const checkSumValue = CryptoJS.enc.Base64.stringify(encryptedStr);
  return checkSumValue;
}
router.post("/checkDuplicateLead", async (req, res) => {
  try {
    const { mobile_no, partner_name, email_id } = req.body;
    data = {
      mobile_no: mobile_no,
      partner_name: partner_name,
      email_id: email_id,
    };
    const c1 = generateCheckSum(data, "_bz_q]o2T,#(wM`D");
    const casheResponse = await axios.post(
      "https://test-partners.cashe.co.in/partner/checkDuplicateCustomerLead",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "Check-Sum": c1,
        },
      },
    );
    res.json(casheResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/preApproval", async (req, res) => {
  try {
    const c2 = generateCheckSum(req.body, "_bz_q]o2T,#(wM`D");
    const casheDetails = await axios.post("https://test-partners.cashe.co.in/report/getLoanApprovalDetails", req.body, {
      headers: {
        "Content-Type": "application/json",
        "Check-Sum": c2,
      },
    });
    res.json(casheDetails.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/createCustomer", async (req, res) => {
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
router.post("/salary", async (req, res) => {
  try {
    const c4 = generateCheckSum(req.body, "_bz_q]o2T,#(wM`D");
    const casheSalaryDetails = await axios.post(
      "https://test-partners.cashe.co.in/partner/fetchCashePlans/salary",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          "Check-Sum": c4,
        },
      },
    );
    res.json(casheSalaryDetails.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/status", async (req, res) => {
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
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const partnerName = req.body.partner_name;
    const partnerCustomerId = req.body.partner_customer_id;
    const fileType = req.body.file_type;

    const filePath = req.file.path;
    console.log(("hey:", req.file.path));
    const fileStream = fs.createReadStream(filePath);

    const formData = new FormData();
    formData.append("file", fileStream);
    formData.append("partner_name", partnerName);
    formData.append("partner_customer_id", partnerCustomerId);
    formData.append("file_type", fileType);

    const c6 = generateCheckSum(formData, "_bz_q]o2T,#(wM`D");

    const casheUploadResponse = await axios.post(
      "https://test-partners.cashe.co.in/partner/document/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
          "Check-Sum": c6,
        },
      },
    );
    res.json(casheUploadResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
