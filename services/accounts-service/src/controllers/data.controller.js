const sequelize = require("../config/db");
const project = require("../models/Project");
const getUsers = async (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;

  try {
    // Verify access to project         
    const proj = await project.findOne({
        where: { id: projectId, ownerId: userId },
    });
    console.log(proj)
    if (!proj) {
      return res.status(403).json({ error: "Access denied to this project" });
    }

    // Fetch users for this project
    const users = await sequelize.query(    
      `SELECT id, email, role
     FROM "endUsers"
     WHERE project_id = :projectId`,
      {
        replacements: { projectId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return res.json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

module.exports = getUsers;
