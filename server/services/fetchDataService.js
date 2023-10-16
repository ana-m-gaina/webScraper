const axios = require("axios");

async function fetchData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

module.exports = { fetchData };
