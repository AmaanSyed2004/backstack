const Project = require("../models/Project");
const APIKey = require("../models/apiKey");
const { v4: uuidv4 } = require("uuid");

const createProject = async (req, res) => {
    try {
        const { name } = req.body;

        const existingProject = await Project.findOne({ where: { name, ownerId: req.user.id } });
        if (existingProject) {
            return res.status(400).json({ success:false,  error: "A project with this name already exists." });
        }

        const project = await Project.create({ name, ownerId: req.user.id });
        res.status(201).json({ success:true, projectId: project.id });
    } catch (err) {
        res.status(400).json({ success:false, error: err.message });
    }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ where: { ownerId: req.user.id } });
    res.json({ success:true, projects });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

const createApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const key = uuidv4();
    const apiKey = await APIKey.create({ key, projectId: id });
    res.status(201).json({ success:true, apiKey: apiKey.key });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  createApiKey,
};
