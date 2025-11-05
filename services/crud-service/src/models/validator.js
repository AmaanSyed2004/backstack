const Ajv = require('ajv').default;
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const cache = new Map();

function getValidator(projectId, collection, schema) {
  const key = `${projectId}|${collection}`;
  if (cache.has(key)) return cache.get(key);
  const validator = ajv.compile(schema);
  cache.set(key, validator);
  return validator;
}

module.exports = { getValidator };
