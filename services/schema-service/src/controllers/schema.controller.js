const CollectionSchema = require("../models/Collections");

exports.createCollection = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, fields } = req.body;

    if (!name || !fields) {
      return res.status(400).json({ error: "Name and fields are required" });
    }
    // fields should be an array of objects with name and type
    if (!Array.isArray(fields) || !fields.every(f => f.name && f.type)) {
      return res.status(400).json({ error: "Fields must be an array of {name, type} objects" });
    }
    //check id if collection with same name exists for the project
    const existing = await CollectionSchema.findOne({ where: { projectId, name } });
    if (existing) {
      return res.status(400).json({ error: "Collection with this name already exists for the project" });
    }
    const collection = await CollectionSchema.create({
      projectId,
      name,
      schemaJson: { fields }
    });

    res.status(201).json({ collection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const { projectId } = req.params;
    const collections = await CollectionSchema.findAll({ where: { projectId } });
    res.json({ collections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await CollectionSchema.findByPk(collectionId);

    if (!collection) return res.status(404).json({ error: "Not found" });
    res.json({ collection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const deleted = await CollectionSchema.destroy({ where: { id: collectionId } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Collection deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//todo: update collection (add/remove fields), idk kaise hoga ye, we are storing the schema as json, so maybe we can just update the json object