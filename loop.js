const axios = require("axios");
const fs = require("fs");

// Load JSON file
const jsonData = require("./data.json"); // Assuming your JSON file is named data.json

// Function to send POST request
async function sendPostRequest(data) {
  try {
    const response = await axios.post("https://example.com/api/endpoint", data);
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Loop through the array in JSON and send each item via POST request
async function sendDataArray(dataArray) {
  for (const item of dataArray) {
    await sendPostRequest(item);
  }
}

// Call the function with the array from your JSON data
sendDataArray(jsonData.array);
