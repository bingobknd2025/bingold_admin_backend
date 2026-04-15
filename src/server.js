
// server.js
require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/database');
const PORT = process.env.PORT;

(async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');

    const server = http.createServer(app);

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`RBAC Backend running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('HTTP server closed');

        const { sequelize } = require('./config/database');
        await sequelize.close();
        console.log('Database connection closed');

        process.exit(0);
      });

      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
})();
