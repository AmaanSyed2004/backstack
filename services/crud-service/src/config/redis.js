const { createClient } = require('redis');
require('dotenv').config();
const logger = require('../utils/logger');

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('connect', () => logger.info('[Redis] Connected'));
client.on('error', (err) => logger.error('[Redis] Error:', err.message));

(async () => {
  await client.connect();
})();

module.exports = client;
