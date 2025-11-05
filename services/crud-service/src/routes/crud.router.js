const express = require('express');
const router = express.Router();
const dynamicController = require('../controllers/crud.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.verifyApiKey);

router
  .route('/:projectId/:collection')
  .post(dynamicController.createRecord)
  .get(dynamicController.listRecords);

router
  .route('/:projectId/:collection/:id')
  .get(dynamicController.getRecord)
  .put(dynamicController.updateRecord)
  .delete(dynamicController.deleteRecord);

module.exports = router;
