const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/user.model");

router.get("/", function (req, res) {
  res.status(200).json({
    type: "success",
    message: "leads service is running",
  });
});

function checkLeadAuth(req, res, next) {
  const authHeader = req.headers["x-api-key"];

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  const expectedAuthValue = "1qa2ws3ed4rf5tg6yh";
  if (authHeader !== expectedAuthValue) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  next();
}

router.post("/inject", checkLeadAuth, async function (req, res) {
  const { lead } = req.body;

  try {
    const [fibePromise, lkPromise, dbPromise] = await Promise.allSettled([
      addtoDB(lead),
      fibeInject(lead),
      lendingKartInject(lead),
    ]);

    const dbRes = dbPromise.status === "fulfilled" ? dbPromise.value : `Error: ${dbPromise.reason.message}`;
    const fibeRes = fibePromise.status === "fulfilled" ? fibePromise.value : `Error: ${fibePromise.reason.message}`;
    const lkRes = lkPromise.status === "fulfilled" ? lkPromise.value : `Error: ${lkPromise.reason.message}`;
    console.log(dbRes);
    res.status(200).json({ fibe: fibeRes, lendingKart: lkRes });
  } catch (error) {
    console.error("Error during injection:", error);
    res.status(500).json({ error: error.message });
  }
});

async function addtoDB(lead) {
  console.log("AddtoDB...");
  let user = await User.findOne({ phone: lead.phone });
  if (!user) {
    newUser = new User({
      name: lead.firstName + " " + lead.lastName,
      phone: lead.phone,
      dob: lead.dob,
      email: lead.email,
      gender: lead.gender,
      city: lead.city,
      state: lead.state,
      pincode: lead.pincode,
      pan: lead.pan,
      company_name: lead.empName,
      income: lead.salary,
      partner: "MoneyTap",
    });
    user = await newUser.save();
  } else {
    user.name = lead.firstName + " " + lead.lastName;
    user.phone = lead.phone;
    user.dob = lead.dob;
    user.email = lead.email;
    user.gender = lead.gender;
    user.city = lead.city;
    user.state = lead.state;
    user.pincode = lead.pincode;
    user.pan = lead.pan;
    user.company_name = lead.empName;
    user.income = lead.salary;
    user.partner = "MoneyTap";

    await user.save();
  }
  return user;
}

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
    consentDatetime: new Date().toISOString(),
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
  const apiUrl = "https://credmantra.com/api/v1/partner-api/lendingkart/p/create-application";
  const lkRes = await axios.post(apiUrl, lkReq);
  return lkRes.data;
}

module.exports = router;
