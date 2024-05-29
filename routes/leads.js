const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/user.model");
const filterLenders = require("../utils/lenderlist.util");
const fs = require("fs");

router.get("/", function (_req, res) {
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

async function usedLenderList(phone) {
    const user = await User.findOne({ phone: phone });
    const userAccounts = user.accounts.map((account) => account.name);
    return userAccounts;
}

router.post("/inject", checkLeadAuth, async function (req, res) {
    const { lead } = req.body;
    try {
        const [dbPromise] = await Promise.allSettled([addtoDB(lead)]);
        const dbRes = dbPromise.status === "fulfilled" ? dbPromise.value : `Error: ${dbPromise.reason.message}`;
        const allRes = { status: "success" };
        res.status(200).json(allRes);
    } catch (error) {
        console.error("Error during injection:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/inject2", checkLeadAuth, async function (req, res) {
    const { lead } = req.body;
    if (lead === undefined || lead.dob === undefined || lead.salary === undefined || lead.pincode === undefined)
        return res.status(200).json({ status: "Insufficient Data" });

    const mainList = await filterLenders(lead.dob, parseInt(lead.salary), parseInt(lead.pincode));
    const availableLenders = ["Fibe", "Prefr", "Cashe", "Upwards", "MoneyView"];
    const usedLender = await usedLenderList(lead.phone);

    // const lenders = availableLenders
    //     .filter((lender) => mainList.includes(lender))
    //     .filter((lender) => !usedLender.includes(lender));
    //
    // if (lenders.length === 0) return res.status(200).json({ status: "Insufficient Data" });

    const lenders = ["Payme"];
    console.log(lead.phone, " lenders: ", lenders);

    const promises = [];

    if (lenders.includes("Fibe")) promises.push(fibeInject(lead));
    if (lenders.includes("LendingKart")) promises.push(lendingKartInject(lead));
    if (lenders.includes("Upwards")) promises.push(upwardsInject(lead));
    if (lenders.includes("Cashe")) promises.push(casheInject(lead));
    if (lenders.includes("Faircent")) promises.push(faircentInject(lead));
    if (lenders.includes("Prefr")) promises.push(prefrInject(lead));
    if (lenders.includes("MoneyView")) promises.push(moneyviewInject(lead));
    if (lenders.includes("Payme")) promises.push(paymeInject(lead));

    try {
        const results = await Promise.allSettled(promises);

        const fibeResult = lenders.includes("Fibe") ? results.shift() : null;
        const fibeRes = fibeResult
            ? fibeResult.status === "fulfilled"
                ? fibeResult.value
                : `Error: ${fibeResult.reason.message}`
            : undefined;

        const lkResult = lenders.includes("LendingKart") ? results.shift() : null;
        const lkRes = lkResult
            ? lkResult.status === "fulfilled"
                ? lkResult.value
                : `Error: ${lkResult.reason.message}`
            : undefined;

        const upwardsResult = lenders.includes("Upwards") ? results.shift() : null;
        const upwardsRes = upwardsResult
            ? upwardsResult.status === "fulfilled"
                ? upwardsResult.value
                : `Error: ${upwardsResult.reason.message}`
            : undefined;

        const casheResult = lenders.includes("Cashe") ? results.shift() : null;
        const casheRes = casheResult
            ? casheResult.status === "fulfilled"
                ? casheResult.value
                : `Error: ${casheResult.reason.message}`
            : undefined;

        const faircentResult = lenders.includes("Faircent") ? results.shift() : null;
        const faircentRes = faircentResult
            ? faircentResult.status === "fulfilled"
                ? faircentResult.value
                : `Error: ${faircentResult.reason.message}`
            : undefined;

        const prefrResult = lenders.includes("Prefr") ? results.shift() : null;
        const prefrRes = prefrResult
            ? prefrResult.status === "fulfilled"
                ? prefrResult.value
                : `Error: ${prefrResult.reason.message}`
            : undefined;

        const mvResult = lenders.includes("MoneyView") ? results.shift() : null;
        const mvRes = mvResult
            ? mvResult.status === "fulfilled"
                ? mvResult.value
                : `Error: ${mvResult.reason.message}`
            : undefined;

        const pResult = lenders.includes("Payme") ? results.shift() : null;
        const pRes = pResult
            ? pResult.status === "fulfilled"
                ? pResult.value
                : `Error: ${pResult.reason.message}`
            : undefined;

        const allRes = {
            fibe: fibeRes,
            lendingKart: lkRes,
            upwards: upwardsRes,
            cashe: casheRes,
            faircent: faircentRes,
            prefr: prefrRes,
            moneyview: mvRes,
            payme: pRes,
        };
        logToFile(allRes);
        res.status(200).json(allRes);
    } catch (error) {
        console.error("Error during injection:", error);
        res.status(500).json({ error: error.message });
    }
});

async function addtoDB(lead) {
    let user = await User.findOne({ phone: lead.phone });
    if (!user) {
        let newUser = new User({
            name: lead.firstName + " " + lead.lastName,
            phone: lead.phone,
            dob: lead.dob,
            email: lead.email,
            gender: lead.gender,
            city: lead.city,
            state: lead.state,
            pincode: lead.pincode,
            pan: lead.pan,
            employment: lead.employment || "Salaried",
            company_name: lead.empName,
            income: lead.salary,
            partner: "MoneyTap",
            partnerSent: false,
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
        user.employment = lead.employment || "Salaried";
        user.pan = lead.pan;
        user.company_name = lead.empName;
        user.income = lead.salary;

        await user.save();
    }
    return user;
}

async function fibeInject(lead) {
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
            salary: Math.ceil(lead.salary) || 21000,
        },
        consent: true,
        consentDatetime: new Date().toISOString(),
    };
    const apiUrl = "https://credmantra.com/api/v1/partner-api/fibe";
    const fibeRes = await axios.post(apiUrl, fibeReq);
    return fibeRes.data;
}

async function lendingKartInject(lead) {
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
    console.log("up started");
    const upwardsDedupe = {
        mobile_number: lead.phone.toString(),
        social_email_id: lead.email,
        pan: lead.pan,
    };
    const apiUrl0 = "https://credmantra.com/api/v1/partner-api/upwards/eligibility";
    try {
        const upwardsRes0 = await axios.post(apiUrl0, upwardsDedupe);
        if (upwardsRes0.data.is_eligible === false) {
            return "Duplicate";
        }
    } catch (error) {
        return error.data;
    }
    const upwardsReq = {
        first_name: lead.firstName,
        last_name: lead.lastName,
        pan: lead.pan,
        dob: lead.dob,
        gender: lead.gender.toLowerCase(),
        social_email_id: lead.email,
        mobile_number1: lead.phone.toString(),
        current_pincode: lead.pincode.toString(),
        current_city: lead.city,
        current_state: lead.state,
        company: lead.empName || "company",
        employment_status_id: 3,
        profession_type_id: 21,
        salary_payment_mode_id: 2,
        salary: parseInt(lead.salary),
        consent: true,
    };
    const apiUrl1 = "https://credmantra.com/api/v1/partner-api/upwards/create";
    const apiUrl2 = "https://credmantra.com/api/v1/partner-api/upwards/complete";
    const apiUrl3 = "https://credmantra.com/api/v1/partner-api/upwards/decision";
    // const apiUrl4 = "https://credmantra.com/api/v1/partner-api/upwards/cibil";

    try {
        const upwardsRes1 = await axios.post(apiUrl1, upwardsReq);
        if (upwardsRes1.data.data.loan_data.customer_id && upwardsRes1.data.data.loan_data.loan_id) {
            // const upwardsRes4 = await axios.post(apiUrl4, {
            //     loan_id: upwardsRes1.data.data.loan_data.loan_id,
            //     customer_id: upwardsRes1.data.data.loan_data.customer_id,
            // });
            // console.log("res4: ", upwardsRes4.data);
            const upwardsRes2 = await axios.post(apiUrl2, {
                loan_id: upwardsRes1.data.data.loan_data.loan_id,
                customer_id: upwardsRes1.data.data.loan_data.customer_id,
            });
            console.log("res2: ", upwardsRes2.data);
            const upwardsRes3 = await axios.post(apiUrl3, {
                loan_id: upwardsRes1.data.data.loan_data.loan_id,
                customer_id: upwardsRes1.data.data.loan_data.customer_id,
            });
            return upwardsRes3.data;
        }
        return upwardsRes1.data;
    } catch (error) {
        return error.data;
    }
}

async function casheInject(lead) {
    const casheDeReq = {
        partner_name: "CredMantra_Partner1",
        mobile_no: lead.phone.toString(),
        email_id: lead.email,
    };
    console.log("casheDeReq", casheDeReq);
    const deDupeUrl = "https://credmantra.com/api/v1/partner-api/cashe/checkDuplicateLead";
    const casheDeRes = await axios.post(deDupeUrl, casheDeReq);
    console.log("dedupe", casheDeRes.data.payLoad);
    if (casheDeRes.data.payLoad === "NO") {
        const casheReq = {
            partner_name: "CredMantra_Partner1",
            pan: lead.pan,
            mobileNo: lead.phone,
            name: lead.firstName + " " + lead.lastName,
            addressLine1: "addressLine1",
            locality: "locality",
            pinCode: lead.pincode,
            gender: lead.gender[0].toUpperCase(),
            salary: lead.salary,
            state: lead.state.toUpperCase(),
            city: lead.city,
            dob: lead.dob + " 00:00:00",
            employmentType: 1,
            salaryReceivedType: 3,
            emailId: lead.email,
            companyName: lead.empName || "OTHERS",
            loanAmount: 200000,
        };

        console.log("casheReq", casheReq);
        const apiUrl = "https://credmantra.com/api/v1/partner-api/cashe/preApproval";
        const casheRes = await axios.post(apiUrl, casheReq);

        console.log("preA", casheRes.data);
        if (casheRes.data.message === "Success") {
            const casheCreateReq = {
                partner_name: "CredMantra_Partner1",
                "Personal Information": {
                    "First Name": lead.firstName,
                    Gender: lead.gender[0].toUpperCase() + lead.gender.slice(1).toLowerCase(),
                    "Address Line 1": casheReq.addressLine1,
                    Pincode: casheReq.pinCode,
                    City: casheReq.city,
                    State: casheReq.state,
                    PAN: casheReq.pan,
                },
                "Applicant Information": {
                    "Company Name": casheReq.companyName || "OTHERS",
                    "Monthly Income": casheReq.salary,
                    "Employment Type": "Salaried full-time",
                    SalaryReceivedTypeId: casheReq.salaryReceivedType,
                },
                "Contact Information": {
                    Mobile: casheReq.mobileNo,
                    "Email Id": casheReq.emailId,
                },
            };
            console.log("casheCreateReq", casheCreateReq);
            const createUrl = "https://credmantra.com/api/v1/partner-api/cashe/createCustomer";
            const casheCreateRes = await axios.post(createUrl, casheCreateReq);
            console.log("create", casheCreateRes.data);
            return casheCreateRes.data;
        }
        return casheRes.data.message;
    }
    return "Duplicate";
}

async function faircentInject(lead) {
    const fcdedupeReq = {
        mobile: lead.phone.toString(),
        email: lead.email,
        pan: lead.pan,
    };
    const faircentReq = {
        fname: lead.firstName,
        lname: lead.lastName,
        dob: lead.dob,
        pan: lead.pan,
        mobile: parseInt(lead.phone),
        pin: parseInt(lead.pincode),
        state: lead.state,
        city: lead.city,
        address: "address1",
        mail: lead.email,
        gender: lead.gender[0].toUpperCase(),
        employment_status: "Salaried",
        loan_purpose: 1365,
        loan_amount: 200000,
        monthly_income: lead.salary,
        consent: "Y",
        tnc_link: "https://www.faircent.in/terms-conditions",
        sign_ip: "3.27.146.211",
        sign_time: Math.floor(Date.now() / 1000),
    };

    const dedupeUrl = "https://credmantra.com/api/v1/partner-api/faircent/dedupe";
    const apiUrl = "https://credmantra.com/api/v1/partner-api/faircent/register";
    const fcdedupeRes = await axios.post(dedupeUrl, fcdedupeReq);
    if (fcdedupeRes.data.result.message === "No Duplicate Record Found.") {
        const faircentRes = await axios.post(apiUrl, faircentReq);
        return faircentRes.data;
    } else {
        return "Duplicate";
    }
    const faircentRes = await axios.post(apiUrl, faircentReq);
    return faircentRes.data;
}

// async function moneytapInject(lead) {
//   const moneytapReq = {
//     mobilenumber: lead.phone || "",
//     profile: {
//       firstname: lead.firstName || "",
//       lastname: lead.lastName || "",
//       dob: lead.dob,
//       profession: "Salaried",
//       address1: "",
//       address2: "",
//       landmark: "",
//       city: lead.city || "",
//       pincode: lead.pincode || "",
//       maritalstatus: "",
//     },
//     finance: {
//       pan: lead.pan ? lead.pan.toUpperCase() : "",
//     },
//     employeedetails: {
//       employername: lead.empName || "",
//       officeaddress: "",
//       officeCity: "",
//       officepincode: lead.pincode || "",
//       salary: Math.ceil(lead.salary) || 0,
//     },
//     consent: true,
//     consentDatetime: new Date().toISOString(),
//   };
//   const apiUrl = "https://credmantra.com/api/v1/partner-api/moneytap";
//   const moneytapRes = await axios.post(apiUrl, moneytapReq);
//   return moneytapRes.data;
// }

async function prefrInject(lead) {
    const prefrDedupeReq = {
        mobileNumber: lead.phone.toString(),
        panNumber: lead.pan,
        personalEmailId: lead.email,
        productName: "pl",
    };
    // const prefrdedupeUrl = "https://credmantra.com/api/v1/partner-api/prefr/dedupe";
    // const prefrStartUrl = "https://credmantra.com/api/v1/partner-api/prefr/start2";
    // const prefrDetailsUrl = "https://credmantra.com/api/v1/partner-api/prefr/details";
    const prefrdedupeUrl = "http://localhost:3000/api/v1/partner-api/prefr/dedupe";
    const prefrStartUrl = "http://localhost:3000/api/v1/partner-api/prefr/start2";
    const prefrDetailsUrl = "http://localhost:3000/api/v1/partner-api/prefr/details";

    const prefrDedupeRes = await axios.post(prefrdedupeUrl, prefrDedupeReq);

    if (prefrDedupeRes.data.data.duplicateFound === false) {
        const prefrStartRes = await axios.post(prefrStartUrl, {
            mobileNo: lead.phone.toString(),
        });
        if (prefrStartRes.data.status === "success") {
            const prefrReq = {
                loanId: prefrStartRes.data.data.loanId,
                firstName: lead.firstName,
                lastName: lead.lastName,
                personalEmailId: lead.email,
                gender: lead.gender.charAt(0).toUpperCase() + lead.gender.slice(1).toLowerCase(),
                dob: lead.dob.split("-").reverse().join("/"),
                panNumber: lead.pan.toUpperCase(),
                employmentType: "salaried",
                desiredLoanAmount: 150000,
                netMonthlyIncome: parseInt(lead.salary),
                currentAddressPincode: lead.pincode.toString(),
                currentAddress: "address 1",
            };

            const prefrRes = await axios.post(prefrDetailsUrl, prefrReq);

            if (prefrRes.data.status === "failure") {
                return "Duplicate Customer";
            }
            return prefrRes.data.status;
        } else {
            return "Failed at Start";
        }
    } else {
        return "Duplicate";
    }
}

async function moneyviewInject(lead) {
    const mvReq = {
        name: lead.firstName + " " + lead.lastName,
        gender: lead.gender.toLowerCase(),
        phone: lead.phone.toString(),
        pan: lead.pan.toUpperCase(),
        dateOfBirth: lead.dob,
        bureauPermission: true,
        addressList: [
            {
                pincode: lead.pincode,
                residenceType: "rented",
                addressType: "current",
            },
        ],
        declaredIncome: parseInt(lead.salary),
        employmentType: lead.employment || "salaried",
        incomeMode: "online",
        emailList: [
            {
                email: lead.email,
                type: "primary_device",
            },
        ],
    };
    const apiUrl1 = "https://credmantra.com/api/v1/partner-api/moneyview/create";
    const apiUrl2 = "https://credmantra.com/api/v1/partner-api/moneyview/offers";
    const apiUrl3 = "https://credmantra.com/api/v1/partner-api/moneyview/journey";
    // const apiUrl1 = "http://localhost:3000/api/v1/partner-api/moneyview/create";
    // const apiUrl2 = "http://localhost:3000/api/v1/partner-api/moneyview/offers";
    // const apiUrl3 = "http://localhost:3000/api/v1/partner-api/moneyview/journey";
    const mvRes = await axios.post(apiUrl1, mvReq);
    if (mvRes.data.status !== "success") return mvRes.data.message;
    const mvRes2 = await axios.post(apiUrl2, { leadId: mvRes.data.leadId, phone: mvReq.phone });
    if (mvRes2.data.status !== "success") return mvRes2.data.message;
    const mvRes3 = await axios.post(apiUrl3, { leadId: mvRes.data.leadId, phone: mvReq.phone });
    if (mvRes3.data.status !== "success") return mvRes3.data.message;
    return mvRes3.data;
}

async function paymeInject(lead) {
    const apiUrl1 = "https://credmantra.com/api/v1/partner-api/payme/dedupe";
    const apiUrl2 = "https://credmantra.com/api/v1/partner-api/payme/register";
    const apiUrl3 = "https://credmantra.com/api/v1/partner-api/payme/cibil";
    const apiUrl4 = "https://credmantra.com/api/v1/partner-api/payme/limit";

    const p1Req = {
        pan_card_number: lead.pan,
        email: lead.email,
        phone_number: lead.phone,
    };
    const p1Res = await axios.post(apiUrl1, p1Req);
    console.log(p1Res.data);
    if (p1Res.data.message !== "user_not_found") return p1Res.data.message;

    const p2Req = {
        email: lead.email,
        phone_number: lead.phone,
        full_name: lead.firstName + " " + lead.lastName,
    };
    const p2Res = await axios.post(apiUrl2, p2Req);
    console.log(p2Res.data);
    if (p2Res.data.message !== "Signed-in Successfully") return p2Res.data.message;

    const pReq3 = {
        address: lead.city + " " + lead.state,
        dob: lead.dob,
        email: lead.email,
        first_name: lead.firstName,
        gender: lead.gender[0].toUpperCase() + lead.gender.slice(1).toLowerCase(),
        last_name: lead.lastName,
        pan_card_number: lead.pan,
        phone_number: lead.phone,
        pin_code: lead.pincode,
        token: p2Res.data.data.token,
    };

    let p3 = {};
    let p4 = {};

    let retries = 3;
    while (retries > 0) {
        try {
            const pRes3 = await axios.post(apiUrl3, pReq3);
            console.log(pRes3.data);
            p3 = pRes3.data;
            break;
        } catch (error) {
            console.error("Error in pRes3 request:", error);
            retries--;
            if (retries === 0) {
                return { error: "Max retries exceeded" };
            }
        }
    }

    try {
        const pRes4 = await axios.post(apiUrl4, { phone_number: pReq3.phone_number, token: p2Res.data.data.token });
        console.log(pRes4.data);
        p4 = pRes4.data;
    } catch (error) {
        console.error("Error in pRes4 request:", error);
    }

    return {
        cibil: p3,
        limit: p4.data,
    };
}

function logToFile(message) {
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentTime = new Date().toLocaleTimeString();
    const logMessage = `${currentDate} ${currentTime}: ${JSON.stringify(message)}\n`;
    fs.appendFile("leads-logfile.txt", logMessage, (err) => {
        if (err) {
            console.error("Error writing to log file:", err);
        }
    });
}

module.exports = router;
