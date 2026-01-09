const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Database connection pool configuration
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'umrahconnect',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

/**
 * Execute query with error handling
 */
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return [results, null];
  } catch (error) {
    console.error('Database query error:', error);
    return [null, error];
  }
};

/**
 * Get connection from pool
 */
const getConnection = async () => {
  return await pool.getConnection();
};

/**
 * Close all connections
 */
const closePool = async () => {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

// Test connection on startup
testConnection();

module.exports = {
  query: pool.query.bind(pool),
  execute: pool.execute.bind(pool),
  getConnection,
  closePool,
  pool
};
