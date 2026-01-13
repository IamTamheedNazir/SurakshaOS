const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * PostgreSQL Database Configuration
 * Using Sequelize ORM for database operations
 */

const sequelize = new Sequelize(
  process.env.DB_NAME || 'umrahconnect_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    
    // Connection pool configuration
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
    },
    
    // SSL configuration (enable in production)
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
    
    // Logging
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Timezone
    timezone: '+05:30', // IST (Indian Standard Time)
    
    // Define options
    define: {
      timestamps: true, // Adds createdAt and updatedAt
      underscored: true, // Use snake_case for column names
      freezeTableName: true, // Prevent pluralization of table names
    },
  }
);

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ PostgreSQL database connection established successfully');
    return true;
  } catch (error) {
    console.error('✗ Unable to connect to PostgreSQL database:', error.message);
    return false;
  }
};

/**
 * Sync database models
 * @param {boolean} force - Drop tables before creating (use with caution!)
 * @param {boolean} alter - Alter tables to match models
 */
const syncDatabase = async (force = false, alter = false) => {
  try {
    await sequelize.sync({ force, alter });
    console.log(`✓ Database synchronized ${force ? '(force)' : alter ? '(alter)' : ''}`);
    return true;
  } catch (error) {
    console.error('✗ Database sync failed:', error.message);
    return false;
  }
};

/**
 * Close database connection
 */
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✓ Database connection closed');
    return true;
  } catch (error) {
    console.error('✗ Error closing database connection:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  closeConnection,
};
