const matchService = require('../services/matchService');
const { AppError } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');

class MatchController {
    //Get match overview -> /api/v1/matches/overview
    async getMatchOverview(req, res, next) {
        try {
            logger.info('MatchController: getMatchOverview called');
            const result = await matchService.getMatchOverview();
            res.status(HTTP_STATUS.OK).json(result);
        } catch (error) {
            logger.error('MatchController: getMatchOverview error:', error);
            next(error);
        }
    }

    //Get teams comparison -> /api/v1/teams/comparison
    async getTeamsComparison(req, res, next) {
        try {
            logger.info('MatchController: getTeamsComparison called');
            const result = await matchService.getTeamsComparison();
            res.status(HTTP_STATUS.OK).json(result);
        } catch (error) {
            logger.error('MatchController: getTeamsComparison error:', error);
            next(error);
        }
    }

    //Get match metadata -> /api/v1/matches/metadata
    async getMatchMetadata(req, res, next){
        try {
            logger.info('MatchController: getMatchMetadata called');
            const result = await matchService.getMatchMetadata();
            res.status(HTTP_STATUS.OK).json(result);
        } catch (error) {
            logger.error('MatchController: getMatchMetadata error:', error);
            next(error);
        }
    }

    // Match health check -> /api/v1/matches/health
    async healthCheck(req, res, next){
        try {
            res.status(HTTP_STATUS.OK).json({
                success:true,
                message: 'Match service is running good',
                timestamp: new Date().toISOString(),
                service: 'match-service'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MatchController();