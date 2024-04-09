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

async function createUser(mobileNo) {
  let user;
  try {
    user = await User.findOne({ phone: mobileNo });
    if (!user) {
      console.log("creating");
      const newUser = new User({ phone: mobileNo });
      user = await newUser.save();
      console.log("User created successfully:", user);
    }
  } catch (mongoError) {
    console.error("MongoDB error:", mongoError);
  }

  if (!user.accounts) {
    console.log("Initializing accounts array...");
    user.accounts = [];
    await user.save();
  }
  return user;
}

async function addToUser(user, data) {
  const AccountData = {
    ...data,
  };

  const AccountIndex = user.accounts.findIndex((account) => account.name === data.name);
  if (AccountIndex !== -1) {
    user.accounts[AccountIndex] = AccountData;
    console.log("found index", AccountIndex);
  } else {
    user.accounts.push(AccountData);
    console.log("pushing...");
  }
  await user.save();
}

1; //----------------------------------------------------------------------------------//
// FAIRCENT API----FAIRCENT API-------FAIRCENT API-----FAIRCENT API----FAIRCENT API //
//----------------------------------------------------------------------------------//

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
    const { mobile } = req.body;
    const user = await createUser(mobile);

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
