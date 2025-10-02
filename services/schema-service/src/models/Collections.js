const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CollectionSchema = sequelize.define("CollectionSchema", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schemaJson: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
});

module.exports = CollectionSchema;
