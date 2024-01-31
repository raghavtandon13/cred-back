// IMPORTS
const express = require("express");
const axios = require("axios");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//----------------------------------------------------------------------------------//
// FAIRCENT API----FAIRCENT API-------FAIRCENT API-----FAIRCENT API----FAIRCENT API //
//----------------------------------------------------------------------------------//

//TODO: Remove console.logs
router.post("/dedupe", async (req, res) => {
  try {
    console.log("Received request at /faircent/dedupe");

    const data = req.body;

    console.log("Received data from frontend:");
    console.log("Data:", data);

    const fResponse = await axios.post("https://fcnode5.faircent.com/v1/api/duplicateCheck", data, {
      headers: {
        "x-application-name": "credmantra",
        "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
        "Content-Type": "application/json",
      },
    });

    console.log("Received response from third-party API:");
    console.log("Status:", fResponse.status);
    console.log("Data:", fResponse.data);
    res.status(200).json(fResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/register", async (req, res) => {
  try {
    console.log("Received request at /faircent/register");

    const data = req.body;

    console.log("Received data from frontend:");
    console.log("Data:", data);

    const fResponse = await axios.post("https://fcnode5.faircent.com/v1/api/aggregrator/register/user", data, {
      headers: {
        "x-application-name": "credmantra",
        "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
        "Content-Type": "application/json",
      },
    });

    console.log("Received response from third-party API:");
    console.log("Status:", fResponse.status);
    console.log("Data:", fResponse.data);

    res.status(200).json(fResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/upload", upload.single("docImage"), async (req, res) => {
  try {
    console.log("Received request at /faircent/upload");
    const { loan_id, token, type } = req.body;
    console.log("loan_id:", loan_id);
    console.log("type:", type);
    console.log("token:", token);

    const docImagePath = req.file.path;
    console.log(("hey:", req.file.path));

    const formData = FormData();
    formData.append("type", type);
    formData.append("loan_id", loan_id);

    const fileStream = fs.createReadStream(docImagePath);

    formData.append("docImage", fileStream);

    console.log("Sending data to third-party API:");
    const fResponse = await axios.post("https://fcnode5.faircent.com/v1/api/uploadprocess", formData, {
      headers: {
        "x-application-name": "credmantra",
        "x-application-id": "eaebf2c8c9a3a16201d6bc31f619b6b1",
        "x-access-token": token,
      },
    });

    console.log("Received response from third-party API:");
    console.log("Data:", fResponse.data);

    res.status(200).json(fResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
