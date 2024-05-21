// Imports
const router = require("express").Router();
const axios = require("axios");
const fs = require("fs");
const CryptoJS = require("crypto-js");
const FormData = require("form-data");
const upload = require("../../middlewares/upload");
const { createUser, updateUser, addToUser } = require("../../middlewares/createUser");
const urlCashe = "https://partners.cashe.co.in";

function generateCheckSum(data) {
    const dataStr = JSON.stringify(data);
    //const encryptedStr = CryptoJS.HmacSHA1(dataStr,"_bz_q]o2T,#(wM`D");
    const encryptedStr = CryptoJS.HmacSHA1(dataStr, "(!4Zb'4'M^0bSoyk");
    const checkSumValue = CryptoJS.enc.Base64.stringify(encryptedStr);
    return checkSumValue;
}

router.post("/cashe/checkDuplicateLead", async (req, res) => {
    try {
        const { mobile_no, partner_name, email_id } = req.body;
        data = {
            mobile_no: mobile_no,
            partner_name: partner_name,
            email_id: email_id,
        };
        console.log(data);
        const c1 = generateCheckSum(data);
        const casheResponse = await axios.post(`${urlCashe}/partner/checkDuplicateCustomerLead`, data, {
            headers: {
                "Content-Type": "application/json",
                "Check-Sum": c1,
            },
        });
        res.json(casheResponse.data);
        console.log(casheResponse.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/cashe/preApproval", async (req, res) => {
    try {
        const c2 = generateCheckSum(req.body);
        const user = await createUser(req.body.mobileNo);
        const casheDetails = await axios.post(`${urlCashe}/report/getLoanApprovalDetails`, req.body, {
            headers: {
                "Content-Type": "application/json",
                "Check-Sum": c2,
            },
        });
        await addToUser(user, {
            name: "Cashe",
            status: casheDetails.data.payLoad.status,
            amount: casheDetails.data.payLoad.amount,
            req: req.body,
            res: casheDetails.data,
        });

        res.json(casheDetails.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/cashe/createCustomer", async (req, res) => {
    try {
        const c3 = generateCheckSum(req.body);
        const user = await createUser(req.body["Contact Information"].Mobile);
        const casheCreate = await axios.post(`${urlCashe}/partner/create_customer`, req.body, {
            headers: {
                "Content-Type": "application/json",
                "Check-Sum": c3,
            },
        });
        await updateUser(user, {
            name: "Cashe",
            id: casheCreate.data.payLoad,
        });
        res.json(casheCreate.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/cashe/salary", async (req, res) => {
    try {
        const c4 = generateCheckSum(data);
        const casheSalaryDetails = await axios.post(`${urlCashe}/partner/fetchCashePlans/salary`, req.body, {
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
        const c5 = generateCheckSum(data);
        const casheSalaryDetails = await axios.post(`${urlCashe}/partner/customer_status`, req.body, {
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

        const c6 = generateCheckSum(data);

        const casheUploadResponse = await axios.post(`${urlCashe}/partner/document/upload`, formData, {
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

module.exports = router;
