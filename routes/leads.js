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

  const expectedAuthValue = "vs65Cu06K1GB2qSdJejP";
  if (authHeader !== expectedAuthValue) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  next();
}

router.post("/inject", checkLeadAuth, async function (req, res) {
  const { lead } = req.body;

  try {
    const [
      fibePromise,
      lkPromise,
      // upwardsPromise,
      dbPromise,
    ] = await Promise.allSettled([
      fibeInject(lead),
      lendingKartInject(lead),
      // upwardsInject(lead),
      addtoDB(lead),
    ]);

    const dbRes = dbPromise.status === "fulfilled" ? dbPromise.value : `Error: ${dbPromise.reason.message}`;
    const fibeRes = fibePromise.status === "fulfilled" ? fibePromise.value : `Error: ${fibePromise.reason.message}`;
    const lkRes = lkPromise.status === "fulfilled" ? lkPromise.value : `Error: ${lkPromise.reason.message}`;
    // const upwardsRes =
    //   upwardsPromise.status === "fulfilled" ? upwardsPromise.value : `Error: ${upwardsPromise.reason.message}`;
    console.log("saved to DB");
    res.status(200).json({
      fibe: fibeRes,
      lendingKart: lkRes,
      // upwards: upwardsRes
    });
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

async function upwardsInject(lead) {
  console.log("upwards...");
  const upwardsReq = {
    first_name: lead.firstName,
    last_name: lead.lastName,
    pan: lead.pan,
    dob: lead.dob,
    gender: lead.gender,
    social_email_id: lead.email,
    mobile_number1: lead.phone,
    current_pincode: lead.phone,
    current_city: lead.city,
    current_state: lead.state,
    company: lead.empName,
    profession_type_id: 3,
    salary_payment_mode_id: 2,
    salary: parseInt(lead.salary),
  };
  console.log("upwardsReq:", upwardsReq);
  const apiUrl1 = "https://credmantra.com/api/v1/partner-api/upwards/create";
  const apiUrl2 = "https://credmantra.com/api/v1/partner-api/upwards/complete";
  const apiUrl3 = "https://credmantra.com/api/v1/partner-api/upwards/decision";

  try {
    const upwardsRes1 = await axios.post(apiUrl1, upwardsReq);
    console.log("ures1:", upwardsRes1);

    const upwardsRes2 = await axios.post(apiUrl2, {
      loan_id: upwardsRes1.data.data.loan_data.loan_id,
      customer_id: upwardsRes1.data.data.loan_data.customer_id,
    });
    console.log("ures2:", upwardsRes2);

    const upwardsRes3 = await axios.post(apiUrl3, {
      loan_id: upwardsRes1.data.data.loan_data.loan_id,
      customer_id: upwardsRes1.data.data.loan_data.customer_id,
    });
    console.log("ures3:", upwardsRes3);

    return upwardsRes3.data;
  } catch (error) {
    console.error("Error during upwards injection:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

module.exports = router;
