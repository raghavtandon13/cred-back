const router = require("express").Router();
const axios = require("axios");
const merchant_id = process.env.PAYME_MERCHANT_ID;
const { createUser, updateUser, addToUser } = require("../../middlewares/createUser");
// const FormData = require("form-data");
// const upload = require("../../middlewares/upload");
// const fs = require("fs");

router.get("/", function(_req, res) {
    res.status(200).json({ type: "success", message: "payme service is running" });
});

router.post("/dedupe", async function(req, res) {
    try {
        const data = { ...req.body, merchant_id: merchant_id };
        const apires = await axios.post("https://api.paymeindia.in/api/authentication/check_user_merchant/", data);
        res.status(200).json(apires.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/register", async function(req, res) {
    try {
        const user = createUser(req.body.phone_number)
        const data = { ...req.body, merchant_id: merchant_id };
        const apires = await axios.post(
            "https://api.paymeindia.in/api/authentication/register_user_merchant/",
            data,
        );
        await addToUser(user, {
            name: "Payme",
            user_id: apires.data.user_id,
        });
        res.status(200).json(apires.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/cibil", async function(req, res) {
    try {
        const data = req.body
        const { token } = req.body
        delete data.token

        const user = createUser(req.body.phone_number)
        const headers = { Authorization: "Token " + token };
        const apires = await axios.post(
            "https://api.paymeindia.in/api/cibil_form_assign/",
            data, { headers }
        );

        await updateUser(user, {
            name: "Payme",
            msg: apires.data.message,
        });
        res.status(200).json(apires.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/limit", async function(req, res) {
    try {
        const { token } = req.body

        const user = createUser(req.body.phone_number)
        const headers = { Authorization: "Token " + token };
        const apires = await axios.get(
            "https://api.paymeindia.in/api/user_details/user_credit/",
            { headers }
        );

        await updateUser(user, {
            name: "Payme",
            limit: apires.data.data,
        });
        res.status(200).json(apires.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// router.post("/authenticate", async function(req, res) {
//     try {
//         const data = { ...req.body, merchant_id: merchant_id };
//         const apires = await axios.post(
//             "https://api.paymeindia.in/api/authentication/authenticate_user_merchant/",
//             data,
//         );
//         res.status(200).json(apires.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// async function get_token(data) {
//     try {
//         const data2 = { ...data, merchant_id: merchant_id };
//         const apires = await axios.post(
//             "https://api.paymeindia.in/api/authentication/authenticate_user_merchant/",
//             data2,
//         );
//         return apires.data.data.token;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }
//
// router.post("/kyc", async function(req, res) {
//     try {
//         const token = await get_token(req.body);
//         const headers = { Authorization: "Token " + token };
//         const apires = await axios.post("https://api.paymeindia.in/api/offline_manual_kyc/", req.body, { headers });
//         res.status(200).json(apires.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// router.post("/prof-details", async function(req, res) {
//     try {
//         const token = await get_token(req.body);
//         const headers = { Authorization: "Token " + token };
//         const apires = await axios.post(
//             "https://api.paymeindia.in/api/user_details/professional_details/",
//             req.body,
//             {
//                 headers,
//             },
//         );
//         res.status(200).json(apires.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// router.post("/doc-status", async function(req, res) {
//     try {
//         const token = await get_token(req.body);
//         const headers = { Authorization: "Token " + token };
//         const apires = await axios.post("https://api.paymeindia.in/api/get_document_status/", { headers });
//         res.status(200).json(apires.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// router.post("/bank-status", async function(req, res) {
//     try {
//         const token = await get_token(req.body);
//         const headers = { Authorization: "Token " + token };
//         const apires = await axios.post("https://api.paymeindia.in/api/user_details/bank_details/", { headers });
//         res.status(200).json(apires.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// router.post("/user-status", async function(req, res) {
//     try {
//         const token = await get_token(req.body);
//         const headers = { Authorization: "Token " + token };
//         const apires = await axios.post("https://api.paymeindia.in/api/v2/general_user_details/", { headers });
//         res.status(200).json(apires.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// router.post("/loan-status", async function(req, res) {
//     try {
//         const token = await get_token(req.body);
//         const headers = { Authorization: "Token " + token };
//         const apires = await axios.post("https://api.paymeindia.in/api/loan/loan_details_get/", req.body, {
//             headers,
//         });
//         res.status(200).json(apires.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
// router.post("/upload", upload.single("file"), async function(req, res) {
//     try {
//         const token = await get_token(req.body);
//         const headers = { Authorization: "Token " + token };
//         const apires = await axios.post("https://api.paymeindia.in/api/upload_to_s3/", req.body, { headers });
//
//         if (apires.data.message === "Upload signed url retrieved") {
//             const uploadUrl = Object.keys(apires.data.data)[0];
//             const uploadUrl2 = apires.data.data[uploadUrl].url;
//
//             const formData = new FormData();
//             for (const key in apires.data.data[uploadUrl].fields) {
//                 formData.append(key, apires.data.data[uploadUrl].fields[key]);
//             }
//             const filepath = req.file.path;
//             const fileStream = fs.createReadStream(filepath);
//             formData.append("file", fileStream);
//
//             const uplaodres = await axios.post(uploadUrl2, formData);
//             if (uplaodres.data.status === 204) {
//                 const updateData = {
//                     doc_type: uploadUrl.split("/")[0],
//                     path: uploadUrl,
//                 };
//                 const api2res = await axios.post(
//                     "https://api.paymeindia.in/api/update_document_status/",
//                     updateData,
//                     { headers },
//                 );
//                 res.status(200).json(api2res.data);
//                 return;
//             }
//             res.status(200).json(uplaodres.data);
//             return;
//         }
//         res.status(200).json(apires.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = router;
