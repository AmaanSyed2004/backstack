const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const endUser = sequelize.define(
  "endUser",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "project_id",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
  },
  {
    tableName: "Users",
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["project_id", "email"],
      },
    ],
  }
);
endUser.belongsTo(require("./Project"), {foreignKey: "projectId"});
module.exports = endUser;
