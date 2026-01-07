const app = require('./app');
const logger = require('./utils/logger');
const { connectPostgres } = require('./config/postgres');
const { connectMongoDB } = require('./config/mongodb');
const { connectRedis } = require('./config/redis');
const { connectElasticsearch } = require('./config/elasticsearch');
const { connectRabbitMQ } = require('./config/rabbitmq');

const PORT = process.env.PORT || 5000;

// ============================================
// DATABASE CONNECTIONS
// ============================================
const initializeConnections = async () => {
  try {
    // Connect to PostgreSQL
    await connectPostgres();
    logger.info('✅ PostgreSQL connected successfully');

    // Connect to MongoDB
    await connectMongoDB();
    logger.info('✅ MongoDB connected successfully');

    // Connect to Redis
    await connectRedis();
    logger.info('✅ Redis connected successfully');

    // Connect to Elasticsearch
    await connectElasticsearch();
    logger.info('✅ Elasticsearch connected successfully');

    // Connect to RabbitMQ
    await connectRabbitMQ();
    logger.info('✅ RabbitMQ connected successfully');

    return true;
  } catch (error) {
    logger.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// ============================================
// START SERVER
// ============================================
const startServer = async () => {
  try {
    // Initialize all database connections
    await initializeConnections();

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🕌 UmrahConnect 2.0 API Server                         ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV?.toUpperCase().padEnd(10)}                              ║
║   Port: ${PORT}                                            ║
║   URL: http://localhost:${PORT}                           ║
║                                                           ║
║   Status: ✅ Running                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
