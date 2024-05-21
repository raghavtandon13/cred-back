// Imports
const router = require("express").Router();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const upload = require("../../middlewares/upload");
const { createUser, addToUser } = require("../../middlewares/createUser");

// Routes
router.get("/faircent/test", function (_req, res, _next) {
    res.status(200).json({
        type: "success",
        message: "faircent service is running",
    });
});

router.post("/faircent/dedupe", async (req, res) => {
    try {
        const data = req.body;
        const fResponse = await axios.post("https://fcnode5.faircent.com/v1/api/duplicateCheck", data, {
            headers: {
                "x-application-name": "credmantra",
                "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
                "Content-Type": "application/json",
            },
        });
        res.status(200).json(fResponse.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/faircent/register", async (req, res) => {
    try {
        const data = req.body;
        const user = await createUser(req.body.mobile);
        const fResponse = await axios.post("https://fcnode5.faircent.com/v1/api/aggregrator/register/user", data, {
            headers: {
                "x-application-name": "credmantra",
                "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
                "Content-Type": "application/json",
            },
        });
        await addToUser(user, {
            name: "Faircent",
            id: fResponse.data.result.loan_id,
            status: fResponse.data.result.status,
            res: data,
            res: fResponse.data,
        });
        res.status(200).json(fResponse.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post("/faircent/upload", upload.single("docImage"), async (req, res) => {
    try {
        const { loan_id, token, type } = req.body;
        const docImagePath = req.file.path;
        const formData = FormData();
        formData.append("type", type);
        formData.append("loan_id", loan_id);
        const fileStream = fs.createReadStream(docImagePath);
        formData.append("docImage", fileStream);
        const fResponse = await axios.post("https://fcnode5.faircent.com/v1/api/uploadprocess", formData, {
            headers: {
                "x-application-name": "credmantra",
                "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
                "x-access-token": token,
            },
        });
        res.status(200).json(fResponse.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
