// this helper function gets the projectID from the accounts service

const axios = require("axios");

const ACCOUNTS_BASE =
  process.env.ACCOUNTS_SERVICE_URL || "http://accounts-service:4000";

async function getProject(projectId) {
  try {
    console.log("Requesting project from accounts service:", projectId);
    const res = await axios.get(`${ACCOUNTS_BASE}/project/${projectId}`, {
      timeout: 5000,
    });
    console.log("Project fetched:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching project:", err.message);
    if (err.response && err.response.status === 404) return null;
    throw err;
  }
}

module.exports = { getProject };
