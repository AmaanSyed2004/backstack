const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createProject,
  getProjects,
  createApiKey,
  getProjectById,
  getApiKeys, 
} = require("../controllers/project.controller");

router.post("/", auth, createProject);
router.get("/", auth, getProjects);
router.get("/:id", getProjectById);

// API Key Routes
router.post("/:id/api-key", auth, createApiKey);
router.get("/:id/api-key", auth, getApiKeys); 

module.exports = router;