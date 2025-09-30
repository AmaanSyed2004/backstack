const router = require("express").Router();
const { createCollection, getCollections, getCollection, deleteCollection } = require("../controllers/schema.controller");
const auth = require("../middleware/auth");

router.post("/:projectId", auth, createCollection);
router.get("/:projectId", auth, getCollections);
router.get("/:projectId/:collectionId", auth, getCollection);
router.delete("/:projectId/:collectionId", auth, deleteCollection);

module.exports = router;
