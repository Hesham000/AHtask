const winston = require('winston');
const config = require('../config/environment');

const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack: true}),
        winston.format.json()
    ),
    defaultMeta: {service: 'lol-match-api'},
    transports: [
        new winston.transports.File({
        filename: 'logs/error.log',
        level:'error',
        maxsize: 5242880,
        maxFiles: 5,
        }),
        new winston.transports.File({
            filename: config.LOG_FILE,
            maxsize: 5242880,
            maxFiles: 5,
        })
    ]
});

//Console logging dev
if(config.NODE_ENV !== 'production'){
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;