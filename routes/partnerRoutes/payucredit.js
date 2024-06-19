// Imports
const router = require("express").Router();
const axios = require("axios");
const domain = "https://payucredit.in";
const headers = { "Content-Type": "application/json", "x-ps-source-key": "someshit" };
const upload = require("../../middlewares/upload");
const FormData = require("form-data");
// const { createUser, updateUser } = require("../../middlewares/createUser");
// const user = await createUser(req.body.phone);
// await updateUser(user, { name: "PaySense", ...response.data.add_application.answer });

router.post("/dedupe", async (req, res) => {
    try {
        const data = { leads: [{ ...req.body }] };
        const response = await axios.post(`${domain}/users/v1/external/direct/dedupe-check`, data, {
            headers: headers,
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error at PaySense Dedupe:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/eligibility", async (req, res) => {
    try {
        const data = req.body;
        const response = await axios.post(
            `${domain}/users/v1/external/direct/check-eligibility`,
            data,
            { headers: headers },
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error at PaySense Eligibility:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/status", async (req, res) => {
    try {
        const { token } = req.body;
        const response = await axios.get(
            `${domain}/users/v1/external/direct/status-check?lead_token=${token}`,
            { headers: headers },
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error at PaySense Status:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

router.post("/upload", upload.single("docImage"), async (req, res) => {
    try {
        const data = req.body;

        const formData = FormData();
        const response = await axios.post(
            `${domain}/docs/v1/external/direct/upload-docs?lead_token=${token}`,
            data,
            { headers: headers },
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error at PaySense Eligibility:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

module.exports = router;

// Request body examples

/* const DEDUPE_API_EXAMPLE = {
    pan: "BBFPC2143F",
    phone: "9769283101",
}; */

/* const ELIGIBILITY_API_EXMAPLE = {
    pan: "HJKPA0404A",
    first_name: "Rick",
    last_name: "Morty",
    date_of_birth: "1993-12-20",
    employment_type: "salaried",
    gender: "male",
    monthly_income: 45000,
    postal_code: "421201",
    phone: "+919767283302",
    email: "subsifellfor@myspace.com",
    terms_accepted: true,
    phone_verified: true,
    user_reason: "RENOVATION", // TRY WITHOUT
}; */
