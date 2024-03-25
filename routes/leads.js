const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", function (req, res) {
  res.status(200).json({
    type: "success",
    message: "leads service is running",
  });
});

router.post("/inject", async function (req, res) {
  console.log("injecting");
  const { lead } = req.body;
  console.log("received lead:", lead);
  try {
    const fibeRes = await fibeInject(lead);
    console.log("fibeResData:", fibeRes);
    const lkRes = await lendingKartInject(lead);
    console.log("lkResData:", lkRes);
    res.status(200).json({ fibe: fibeRes, lendingKart: lkRes });
  } catch (error) {
    console.error("Error during fibe injection:", error);
    res.status(500).json({ error: error });
  }
});

async function fibeInject(lead) {
  console.log("fibe...");
  const fibeReq = {
    mobilenumber: lead.phone || "",
    profile: {
      firstname: lead.firstName || "",
      lastname: lead.lastName || "",
      dob: lead.dob,
      profession: "Salaried",
      address1: "",
      address2: "",
      landmark: "",
      city: lead.city || "",
      pincode: lead.pincode || "",
      maritalstatus: "",
    },
    finance: {
      pan: lead.pan ? lead.pan.toUpperCase() : "",
    },
    employeedetails: {
      employername: lead.empName || "",
      officeaddress: "",
      officeCity: "",
      officepincode: lead.pincode || "",
      salary: Math.ceil(lead.salary) || 0,
    },
    consent: true,
    consentDatetime: new Date().toISOString(), // Assign current datetime
  };
  const apiUrl = "https://credmantra.com/api/v1/partner-api/fibe";
  const fibeRes = await axios.post(apiUrl, fibeReq);
  return fibeRes.data;
}
async function lendingKartInject(lead) {
  console.log("lk...");
  const lkReq = {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    mobile: lead.phone.toString(),
    personalDob: lead.dob,
    personalPAN: lead.pan.toUpperCase(),
    gender: lead.gender,
    personalAddress: {
      pincode: lead.pincode.toString(),
      city: lead.city,
      state: lead.state,
    },
    loanAmount: 200000,
    productType: "Personal Loan",
    uniqueId: "",
    cibilConsentForLK: true,
    otherFields: {
      consentTimestamp: "2024-03-09T06:57:32.000+00:00",
      employmentType: "FULL_TIME",
      monthlySalary: lead.salary,
      monthlyProfit: null,
      tenure: "18",
      itrFiled: false,
      maritalStatus: "SINGLE",
      companyName: lead.empName || "OTHERS",
      companyEmailId: lead.email,
    },
  };
  console.log("lkReq:", lkReq);
  const apiUrl = "https://credmantra.com/api/v1/partner-api/lendingkart/p/create-application";
  const lkRes = await axios.post(apiUrl, lkReq);
  return lkRes.data;
}
module.exports = router;
