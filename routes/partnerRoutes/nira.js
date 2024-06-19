// Imports
const router = require("express").Router();
const axios = require("axios");
const { createUser, updateUser } = require("../../middlewares/createUser");
const domain = "https://nira.temp";

router.post("/", async (req, res) => {
    try {
        const headers = { "Content-Type": "application/json" };
        const data = { uuid: "CM-" + uuidv4().replace(/-/g, ""), ...req.body };
        const user = await createUser(req.body.mobileNo);
        const response = await axios.post(`${domain}/CreateApplication`, data, {
            headers: headers,
        });
        await updateUser(user, { name: "Nira", ...response.data });
        res.json(response.data);
    } catch (error) {
        console.error("Error at NIRA:", error.message);
        res.status(error.response.status).json({ error: error.response.data });
    }
});

/* {
    "uuid": "4Cpok4yJse",
    "partnerIdentifier": "POCHHRMS0001",
    "dateOfBirth": "25-10-1986",
    "gender": "Male",
    "maritalStatus": "Single",
    "organizationName": "ACME RANDOMNESS AND INTEGRITY SERVICES LTD.",
    "employmentType": "Salaried",
    "experienceInMonths": 8,
    "monthlySalary": 50000,
    "existingTotalEMIAmount": 2345,
    "firstName": "Antony",
    "lastName": "Gonsalves",
    "personalEmailID": "coolestanto86@rediff.co.in",
    "mobileNo": "9000000000",
    "designation": "Lead Analyst",
    "pinCode": "560047",
    "city": "Bangalore",
    "state": "Karnataka",
    "addressLine1": "Kholi No. 420, Roop Mahal",
    "addressLine2": "Prem Gali, Koramangala",
    "hometown": "Anekal",
    "salaryMode": "Bank",
    "jobSector": "Facility Management/Security",
    "workStatus": "Working full time"
} */
