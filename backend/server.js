const app = require("./src/app");
const config = require('./src/config/environment');
const logger = require('./src/utils/logger');

const server = app.listen(config.PORT, () => {
    logger.info(`Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    logger.info(`API Documentation: http://localhost:${config.PORT}/api/${config.API_VERSION}/health`);
});

// Shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM Signal received. Shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});