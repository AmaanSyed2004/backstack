const db = require('../config/db');
const { getSchema } = require('../models/schemaModel');
const { getValidator } = require('../models/validator');
const { ensureTable } = require('../models/tableGenerator');
const { sanitizeName } = require('../utils/helper');
const logger = require('../utils/logger');
const getCollectionName = require('../utils/collection_name');

const getTableName = (pid, coll) => `data_${pid}_${coll}`;

exports.createRecord = async (req, res) => {
  try {
    const { projectId, collection } = req.params;
    const schemaData = await getSchema(projectId, collection);
    if (!schemaData) return res.status(404).json({ error: 'Schema not found' });

    const validator = getValidator(projectId, collection, schemaData.schemaJson);
    if (!validator(req.body))
      return res.status(400).json({ errors: validator.errors });
    const collectionName = await getCollectionName(collection);
    const table = await ensureTable(projectId, collectionName, schemaData.schemaJson);
    const fields = Object.keys(req.body);
    const placeholders = fields.map((_, i) => `$${i + 1}`);
    const sql = `INSERT INTO "${table}" (${fields
      .map((f) => `"${f}"`)
      .join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
    const result = await db.query(sql, Object.values(req.body));

    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.listRecords = async (req, res) => {
  try {
    const { projectId, collection } = req.params;
    const schemaData = await getSchema(projectId, collection);
    if (!schemaData) return res.status(404).json({ error: 'Schema not found' });

    const table = await ensureTable(projectId, collection, schemaData.schemaJson);
    const limit = Math.min(parseInt(req.query.limit || 25), 100);
    const offset = parseInt(req.query.offset || 0);
    const sql = `SELECT * FROM "${table}" ORDER BY id DESC LIMIT $1 OFFSET $2`;
    const result = await db.query(sql, [limit, offset]);
    res.json(result.rows);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getRecord = async (req, res) => {
  try {
    const { projectId, collection, id } = req.params;
    const schemaData = await getSchema(projectId, collection);
    if (!schemaData) return res.status(404).json({ error: 'Schema not found' });

    const table = getTableName(projectId, collection);
    const sql = `SELECT * FROM "${table}" WHERE id = $1`;
    const result = await db.query(sql, [id]);

    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const { projectId, collection, id } = req.params;
    const schemaData = await getSchema(projectId, collection);
    if (!schemaData) return res.status(404).json({ error: 'Schema not found' });

    const validator = getValidator(projectId, collection, schemaData.schemaJson);
    if (!validator(req.body))
      return res.status(400).json({ errors: validator.errors });

    const table = getTableName(projectId, collection);
    const fields = Object.keys(req.body);
    const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ');
    const sql = `UPDATE "${table}" SET ${setClause}, updated_at = now() WHERE id = $${
      fields.length + 1
    } RETURNING *`;
    const result = await db.query(sql, [...Object.values(req.body), id]);

    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const { projectId, collection, id } = req.params;
    const table = getTableName(projectId, collection);
    const sql = `DELETE FROM "${table}" WHERE id = $1 RETURNING *`;
    const result = await db.query(sql, [id]);

    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: result.rows[0] });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};
