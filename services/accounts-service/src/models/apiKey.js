const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./Project");

const APIKey = sequelize.define("APIKey", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  key: { type: DataTypes.STRING, allowNull: false },
});

APIKey.belongsTo(Project, { foreignKey: "projectId" });
Project.hasMany(APIKey, { foreignKey: "projectId" });

module.exports = APIKey;
