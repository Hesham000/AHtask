const express = require('express');
const matchController = require('../controllers/matchController');
const router = express.Router();

// Get overview
router.get('/overview', matchController.getMatchOverview);

//Get team details
router.get('/teams/comparison', matchController.getTeamsComparison)

//Get match data
router.get('/metadata', matchController.getMatchMetadata);

//check health
router.get('/health', matchController.healthCheck);

module.exports = router;