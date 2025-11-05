const db = require('../config/db'); // Import pg Pool

async function getCollectionName(tableName) {
    try {
        const query = 'SELECT name FROM "CollectionSchemas" WHERE "id" = $1';
        const values = [tableName];
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new Error(`Table ${tableName} not found in CollectionSchemas`);
        }

        return result.rows[0].name;
    } catch (error) {
        console.error('Error fetching collection name:', error.message);
        throw error;
    }
}

module.exports = getCollectionName;