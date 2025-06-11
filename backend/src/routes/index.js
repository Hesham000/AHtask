const express = require('express');
const matchRoutes = require('./matchRoutes');
const playerRoutes = require('./playerRoutes');
const router = express.Router();

router.use('/matches', matchRoutes);
router.use('/players', playerRoutes);

//Endpoints
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the League of Legends Analytics API',
        version: '1.0.0',
        endpoints: {
            matches: '/api/v1/matches',
            players: '/api/v1/players'
        }
    })
})

module.exports = router;