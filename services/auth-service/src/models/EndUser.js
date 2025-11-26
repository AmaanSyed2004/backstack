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
// the project ID here will NOT be a foriegn key, rather will be filled using a GET request to the accounts service to verify the project exists
module.exports = endUser;
