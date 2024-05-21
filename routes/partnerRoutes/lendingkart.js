// Imports
const router = require("express").Router();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const upload = require("../../middlewares/upload");
const { createUser, addToUser } = require("../../middlewares/createUser");

// Routes
router.post("/lendingkart/lead-exists-status", async (req, res) => {
    try {
        console.log("Recieved: ", req.body);
        data = req.body;
        const lkResponse = await axios.post(
            "https://lkext.lendingkart.com/admin/lead/v2/partner/leads/lead-exists-status",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": "2e067259-5f4a-4ed1-880f-ece8e7b1b9dd",
                },
            },
        );
        res.json(lkResponse.data);
        console.log(lkResponse);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// "X-Api-Key": "2e067259-5f4a-4ed1-880f-ece8e7b1b9dd",
router.post("/lendingkart/p/create-application", async (req, res) => {
    //const url = "https://lkext.lendingkart.com/admin/lead/v2/partner/leads/create-application"
    const url = "https://api.lendingkart.com/v2/partner/leads/create-application";
    try {
        const { mobile } = req.body;
        const data = req.body;
        console.log("lendingkart:", req.body);
        console.log("phone:", mobile);
        const user = await createUser(mobile);
        const lkResponse = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": "4c71ff7f-9dff-4ebf-bd5a-0e475ddf68b1",
            },
        });
        await addToUser(user, {
            name: "LendingKart",
            leadId: lkResponse.data.leadId,
            applicationId: lkResponse.data.applicationId,
            message: lkResponse.data.message,
            redirectionLink: lkResponse.data.redirectionLink,
            req: data,
            res: lkResponse.data,
        });
        res.json(lkResponse.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});
router.post("/lendingkart/create-application", async (req, res) => {
    try {
        data = req.body;
        const lkResponse = await axios.post(
            "https://lkext.lendingkart.com/admin/lead/v2/partner/leads/create-application",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": "2e067259-5f4a-4ed1-880f-ece8e7b1b9dd",
                },
            },
        );
        res.json(lkResponse.data);
        console.log(lkResponse);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/lendingkart/2documents2", async (req, res) => {
    try {
        data = req.body;
        const lkResponse = await axios.post(
            `https://api.lendingkart.com/v2/partner/leads/documents/${applicationId}/${documentType}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": "aaaa-bbbb-cccc-dddd",
                },
            },
        );
        res.json(lkResponse.data);
        console.log(lkResponse);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/lendingkart/3documents3", upload.single("docImage"), async (req, res) => {
    try {
        const { applicationId, documentType } = req.body;
        const docImagePath = req.file.path;
        const fileStream = fs.createReadStream(docImagePath);
        const formData = new FormData();
        formData.append("file", fileStream);
        const lkResponse = await axios.post(
            `https://api.lendingkart.com/v2/partner/leads/documents/${applicationId}/${documentType}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": "2e067259-5f4a-4ed1-880f-ece8e7b1b9dd",
                },
            },
        );
        res.json(lkResponse.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post("/lendingkart/documents", upload.single("docImage"), async (req, res) => {
    try {
        const { applicationId, documentType } = req.body;
        const docImagePath = req.file.path;
        const fileStream = fs.createReadStream(docImagePath);
        const formData = new FormData();
        formData.append("file", fileStream);

        const url = `https://api.lendingkart.com/v2/partner/leads/documents/${applicationId}/${documentType}`;
        console.log("URL Triggered:", url);

        const lkResponse = await axios.post(url, formData, {
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": "2e067259-5f4a-4ed1-880f-ece8e7b1b9dd",
            },
        });
        res.json(lkResponse.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post("/lendingkart/magiclink", async (req, res) => {
    try {
        const { applicationId } = req.body;
        const lkResponse = await axios.get(`https://api.lendingkart.com/v2/partner/leads/magic-link/${applicationId}`, {
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": "aaaa-bbbb-cccc-dddd",
            },
        });
        res.json(lkResponse.data);
        console.log(lkResponse);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
