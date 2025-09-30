const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  plan: { type: DataTypes.STRING, defaultValue: "free" }
});

Project.belongsTo(User, { foreignKey: "ownerId" });
User.hasMany(Project, { foreignKey: "ownerId" });

module.exports = Project;
