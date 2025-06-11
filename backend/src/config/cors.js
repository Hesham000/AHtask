const cors = require('cors');
const config = require('./environment');

const corsOptions = {
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
      
        if (config.ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
},
credentials: true,
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization'],
maxAge: 86400,
};

module.exports = cors(corsOptions);