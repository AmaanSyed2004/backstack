const db = require('../config/db');
const redis = require('../config/redis');
const logger = require('../utils/logger');

const CACHE_TTL = 30; 

async function getSchema(projectId, collection) {
  const key = `schema:${projectId}:${collection}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
        logger.info(`[Cache HIT] ${key}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    logger.error('[Redis] Get error:', err.message);
  }

  const res = await db.query(
    'SELECT * FROM "CollectionSchemas" WHERE "projectId" = $1 AND id = $2',
    [projectId, collection]
  );
  if (res.rowCount === 0) return null;

  const schema = res.rows[0];

  try {
    await redis.setEx(key, CACHE_TTL, JSON.stringify(schema));
    logger.info(`[Cache SET] ${key}`);
  } catch (err) {
    logger.error('[Redis] Set error:', err.message);
  }

  return schema;
}

async function invalidateSchemaCache(projectId, collection) {
  const key = `schema:${projectId}:${collection}`;
  try {
    await redis.del(key);
    logger.info(`[Cache DEL] ${key}`);
  } catch (err) {
    logger.error('[Redis] Del error:', err.message);
  }
}

module.exports = { getSchema, invalidateSchemaCache };
