const router = require("express").Router();
const auth = require("../middleware/auth");
const { createProject, getProjects, createApiKey } = require("../controllers/project.controller");

router.post("/", auth, createProject);
router.get("/", auth, getProjects);
router.post("/:id/api-key", auth, createApiKey);

module.exports = router;
