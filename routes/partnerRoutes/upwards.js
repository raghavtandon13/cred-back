// Imports
const router = require("express").Router();
const axios = require("axios");
const { createUser, addToUser } = require("../../middlewares/createUser");
const affiliatedUserId = 71;
const affiliatedUserSecret = "1sMBh1oAXgmT54aPJj7do6pIQpsMch71";

// Routes
router.post("/eligibility", async (req, res) => {
    try {
        const response = await axios.post("https://leads.backend.upwards.in/af/v1/authenticate/", {
            affiliated_user_id: affiliatedUserId,
            affiliated_user_secret: affiliatedUserSecret,
        });
        let headers = {};
        if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
            headers = {
                "Affiliated-User-Id": affiliatedUserId,
                "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
            };
        } else {
            console.error("affiliated_user_session_token not found in the response data.");
        }

        const loanEligibilityRequest = req.body;
        const eligibilityResponse = await axios.post(
            "https://leads.backend.upwards.in/af/v1/customer/loan/eligibility/",
            loanEligibilityRequest,
            {
                headers,
            },
        );
        res.json(eligibilityResponse.data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});

router.post("/create", async (req, res) => {
    try {
        const { mobile_number1 } = req.body;
        const response = await axios.post("https://leads.backend.upwards.in/af/v1/authenticate/", {
            affiliated_user_id: affiliatedUserId,
            affiliated_user_secret: affiliatedUserSecret,
        });
        const user = createUser(mobile_number1);
        let headers = {};
        if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
            headers = {
                "Affiliated-User-Id": affiliatedUserId,
                "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
            };
        } else {
            console.error("affiliated_user_session_token not found in the response data.");
        }
        const loanDataResponse = await axios.post(
            "https://leads.backend.upwards.in/af/v2/customer/loan/data/create/",
            req.body,
            { headers },
        );
        addToUser(user, {
            name: "Upwards",
            id: loanDataResponse.data.data.loan_data.loan_id || null,
            status: loanDataResponse.data.data.is_success ? "success" : "failure",
            sent: req.body,
            res: loanDataResponse.data,
        });
        res.json(loanDataResponse.data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error });
    }
});

router.post("/cibil", async (req, res) => {
    //NOTE: req.body should only contain customer_id and loan_id
    try {
        const response = await axios.post("https://leads.backend.upwards.in/af/v1/authenticate/", {
            affiliated_user_id: affiliatedUserId,
            affiliated_user_secret: affiliatedUserSecret,
        });

        let headers = {};
        if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
            headers = {
                "Affiliated-User-Id": affiliatedUserId,
                "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
            };
        } else {
            console.error("affiliated_user_session_token not found in the response data.");
        }

        const completeRequest = { cibil_report_type_id: 1, cibil_report_json_data: {}, ...req.body };

        const completeResponse = await axios.post(
            "https://leads.backend.upwards.in/af/v2/customer/loan/bureau/data/",
            completeRequest,
            {
                headers,
            },
        );
        res.json(completeResponse.data);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

router.post("/complete", async (req, res) => {
    //NOTE: req.body should only contain customer_id and loan_id
    try {
        const response = await axios.post("https://leads.backend.upwards.in/af/v1/authenticate/", {
            affiliated_user_id: affiliatedUserId,
            affiliated_user_secret: affiliatedUserSecret,
        });

        let headers = {};
        if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
            headers = {
                "Affiliated-User-Id": affiliatedUserId,
                "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
            };
        } else {
            console.error("affiliated_user_session_token not found in the response data.");
        }

        const completeRequest = req.body;

        const completeResponse = await axios.post(
            "https://leads.backend.upwards.in/af/v2/customer/loan/data/complete/",
            completeRequest,
            {
                headers,
            },
        );
        res.json(completeResponse.data);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

router.post("/decision", async (req, res) => {
    //NOTE: req.body should only contain customer_id and loan_id
    try {
        const response = await axios.post("https://leads.backend.upwards.in/af/v1/authenticate/", {
            affiliated_user_id: affiliatedUserId,
            affiliated_user_secret: affiliatedUserSecret,
        });

        let headers = {};
        if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
            headers = {
                "Affiliated-User-Id": affiliatedUserId,
                "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
            };
        } else {
            console.error("affiliated_user_session_token not found in the response data.");
        }

        const decisionRequest = req.body;

        const decisionResponse = await axios.post(
            "https://leads.backend.upwards.in/af/v2/customer/loan/credit_programs/decision/",
            decisionRequest,
            {
                headers,
            },
        );
        res.json(decisionResponse.data);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

router.post("/transition", async (req, res) => {
    //NOTE: req.body should only contain customer_id and loan_id
    try {
        const response = await axios.post("https://leads.backend.upwards.in/af/v1/authenticate/", {
            affiliated_user_id: affiliatedUserId,
            affiliated_user_secret: affiliatedUserSecret,
        });

        let headers = {};
        if (response.data && response.data.data && response.data.data.affiliated_user_session_token) {
            headers = {
                "Affiliated-User-Id": affiliatedUserId,
                "Affiliated-User-Session-Token": response.data.data.affiliated_user_session_token,
            };
        } else {
            console.error("affiliated_user_session_token not found in the response data.");
        }

        const transitionRequest = req.body;

        const transitionResponse = await axios.post(
            "https://leads.backend.upwards.in/af/v2/customer/loan/transition_data/",
            transitionRequest,
            {
                headers,
            },
        );
        res.json(transitionResponse.data);
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

module.exports = router;
