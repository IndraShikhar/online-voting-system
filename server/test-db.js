// test-db.js

import db from './utils/db.js';

async function testConnection() {
  try {
    // safer query (no trailing semicolon, non-conflicting alias)
    const [rows] = await db.query('SELECT CURRENT_TIMESTAMP AS now_time');
    console.log('✅ MySQL Connected Successfully!');
    console.log('Current Time:', rows[0].now_time);
    process.exit(0);
  } catch (err) {
    console.error('❌ Database connection failed:');
    // helpful debugging info
    console.error('Error code:', err.code);
    console.error('Error number:', err.errno);
    console.error('SQL message:', err.sqlMessage || err.message);
    if (err.sql) console.error('SQL that failed:', err.sql);
    process.exit(1);
  }
}

testConnection();
