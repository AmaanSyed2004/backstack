const db = require('../config/db');
const { sanitizeName } = require('../utils/helper');

function mapType(schema) {
  const t = schema.type;
  if (t === 'string') return schema.format === 'date-time' ? 'TIMESTAMPTZ' : 'TEXT';
  if (t === 'integer') return 'INTEGER';
  if (t === 'number') return 'DOUBLE PRECISION';
  if (t === 'boolean') return 'BOOLEAN';
  if (t === 'object' || t === 'array') return 'JSONB';
  return 'TEXT';
}

async function ensureTable(projectId, collection, schema) {
  const tableName = `data_${projectId}_${collection}`;
  const props = schema.fields.properties || {};
  const required = new Set(schema.required || []);
//owner_id is a uuid
  await db.query(`
    CREATE TABLE IF NOT EXISTS "${tableName}" (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      owner_id UUID
    );
  `);

  for (const [field, def] of Object.entries(props)) {
    const colType = mapType(def);
    await db.query(
      `ALTER TABLE "${tableName}" ADD COLUMN IF NOT EXISTS "${field}" ${colType};`
    );
    if (required.has(field) && colType !== 'JSONB') {
      await db.query(
        `ALTER TABLE "${tableName}" ALTER COLUMN "${field}" SET NOT NULL;`
      ).catch(() => {});
    }
  }

  for (const [field, def] of Object.entries(props)) {
    if (!def['x-ref'] && !def['ref']) continue;
    const ref = def['x-ref'] || def['ref'];
    const refTable = `data_${projectId}_${ref}`;
    const fkName = `${tableName}_${field}_fk`.slice(0, 60);

    const sql = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = '${fkName}'
        ) THEN
          ALTER TABLE "${tableName}"
          ADD CONSTRAINT "${fkName}"
          FOREIGN KEY ("${field}") REFERENCES "${refTable}"("id");
        END IF;
      END$$;
    `;
    await db.query(sql);
  }

  return tableName;
}

module.exports = { ensureTable };
