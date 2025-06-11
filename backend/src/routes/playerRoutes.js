const express = require('express');
const playerController = require('../controllers/playerController');
const  { validatePuuid, validatePuuidComparison } = require('../middleware/validation');
const router = express.Router();

//Get players summary
router.get('/summary', playerController.getPlayersSummary);

// compare two players (must come before /:puuid)
router.get('/compare/:puuid1/:puuid2', validatePuuidComparison, playerController.comparePlayer);

//Get player details (must come after specific routes)
router.get('/:puuid', validatePuuid, playerController.getPlayerDetails);

module.exports = router;