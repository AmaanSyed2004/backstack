const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createProject,
  getProjects,
  createApiKey,
  getApiKeys, // Import the new function
} = require("../controllers/project.controller");

router.post("/", auth, createProject);
router.get("/", auth, getProjects);

// API Key Routes
router.post("/:id/api-key", auth, createApiKey);
router.get("/:id/api-key", auth, getApiKeys); // Add this GET route

module.exports = router;