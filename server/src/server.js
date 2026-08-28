const http = require('http');
const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const seedData = require('./utils/seed');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Seed initial data
    await seedData();

    // 3. Create HTTP server
    const httpServer = http.createServer(app);

    // 4. Initialize Socket.IO
    initSocket(httpServer, env.clientUrl);

    // 5. Start listening
    httpServer.listen(env.port, () => {
      logger.info(`[Server] CCMS API running on port ${env.port} in ${env.nodeEnv} mode`);
      logger.info(`[Server] Socket.IO initialized for origin ${env.clientUrl}`);
    });
  } catch (error) {
    logger.error('[Server] Fatal startup error:', error);
    process.exit(1);
  }
};

startServer();
