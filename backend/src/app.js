const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require('express-rate-limit');

const config = require('./config/environment');
const corsConfig = require('./config/cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

//Middleware securtiy
app.use(helmet());
app.use(corsConfig);

// Rate limiting
const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    message: {
        error: 'Too many requests, please try again later',
        retryAfter: Math.ceil(config.RATE_LIMIT_WINDOW_MS / 1000)
    }
});
app.use(limiter);

//Compression and parsing
app.use(compression());
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));

//logging
app.use(morgan('combined',{
    stream: {write: message => logger.info(message.trim())}
}));

//API Routes
app.use(`/api/${config.API_VERSION}`, routes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      enviroment: config.NODE_ENV,
      version: config.API_VERSION
    });
  });

  //404 handler
  app.use('*', (req, res)=>{
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
  });

  app.use(errorHandler);
  
  module.exports = app;