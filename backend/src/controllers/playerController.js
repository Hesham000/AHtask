const playerService = require('../services/playerService');
const { AppError } = require('../middleware/errorHandler');
const { HTTP_STATUS, API_MESSAGES} = require('../utils/constants');
const logger = require('../utils/logger');
const { validatePuuid} = require('../middleware/validation');

class PlayerController {
    //Get player details for MVP page -> /api/v1/players/:puuid
    async getPlayerDetails(req, res, next) {
        try {
            const { puuid } = req.params;
            logger.info(`PlayerController: getPlayerDetails called for PUUID: ${puuid}`);
            const result = await playerService.getPlayerDetails(puuid);
            res.status(HTTP_STATUS.OK).json(result);
        } catch (error) {
            logger.error('PlayerController: Error in getPlayerDetails:', error);
            next(error);
        }
    }

    //Compare two players -> /api/v1/players/compare/:puuid1/:puuid2
    async comparePlayer(req,res, next){
        try {
            const { puuid1, puuid2} = req.params;
            logger.info(`PlayerController: comparePlayer called for PUUIDs: ${puuid1},${puuid2}`);
            if(puuid1 === puuid2){
                throw new AppError('Cannot compare a player with himself', HTTP_STATUS.BAD_REQUEST);
            }
            const result = await playerService.getPlayerComparison(puuid1, puuid2);
            res.status(HTTP_STATUS.OK).json(result);
        } catch (error) {
            logger.error('PlayerController: Error in comparePlayer:', error);
            next(error);
        }
    }

    //Get all players -> /api/v1/players/summary
    async getPlayersSummary(req, res, next){
        try {
            logger.info('PlayerController: getPlayerSummary called');
            const matchOverview = await require('../services/matchService').getMatchOverview();
            const playersSummary = matchOverview.data.teams.flatMap( team =>
                team.players.map(player =>({
                    puuid: player.puuid,
                    playerName: player.playerName,
                    tagline: player.tagline,
                    championName: player.championName,
                    teamId: team.teamId,
                    win: team.win,
                    kills: player.kills,
                    deaths: player.deaths,
                    assists: player.assists,
                    killParticipation: player.killParticipation,
                }))
            );

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Players summary retrieved successfully',
                data: playersSummary,
                meta: {
                    totalPlayers: playersSummary.length,
                    retrievedAt: new Date().toISOString(),
                }
            })
        } catch (error) {
            logger.error('PlayerController: Error in getPlayerSummary:', error);
            next(error);
        }
    }
}

module.exports = new PlayerController();
