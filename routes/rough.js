//#region LENDINGKART
//--------------------------------------------------------------------------------//
// LendingKart API------LendingKart API------LendingKart API------LendingKart API //
// leadExists===false
//--------------------------------------------------------------------------------//
const LK_Key = "your_api_key_here";

// Define the base URL for Lendingkart API
const lendingkartBaseUrl = "https://api.lendingkart.com/v2/partner/leads";

router.post("/lendingkart", async (req, res) => {
  // Extract mobile and email from the request body
  const { mobile, email, ...otherData } = req.body;

  // Step 1: Check if the user exists
  try {
    const existsResponse = await axios.post(
      `${lendingkartBaseUrl}/lead-exists-status`,
      { mobile, email },
      {
        headers: { "X-Api-Key": LK_Key },
      }
    );

    if (existsResponse.data === false) {
      // Step 2: User doesn't exist, proceed to create a new application
      try {
        const createResponse = await axios.post(
          `${lendingkartBaseUrl}/create-application`,
          { mobile, email, ...otherData },
          {
            headers: { "X-Api-Key": LK_Key },
          }
        );

        // Assuming Lendingkart responds with some confirmation data
        res.json({
          message: "Application created successfully",
          data: createResponse.data,
        });
      } catch (error) {
        console.error("Error creating application:", error);
        res.status(500).json({ error: "Failed to create application" });
      }
    } else {
      // User already exists
      res.status(400).json({ error: "User already exists" });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Failed to check user existence" });
  }
});

router.get("/lendingkart-status/:applicationId", async (req, res) => {
  const { applicationId } = req.params;

  try {
    const response = await axios.get(`${lendingkartBaseUrl}/applicationStatus/${applicationId}`, {
      headers: { "X-Api-Key": apiKey },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error checking application status:", error);
    res.status(500).json({ error: "Failed to check application status" });
  }
});
//#endregion
