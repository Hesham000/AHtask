const Match = require('../models/Match');
const { AppError } = require('../middleware/errorHandler');
const { API_MESSAGES, HTTP_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');
const { validatePuuid} = require('../utils/helpers');
const matchData = require('../data/GAME_NA1_5299363459.json');

class PlayerService {
    constructor() {
        this.match = new Match(matchData);
    }

    async getPlayerDetails(puuid) {
        try {
            if(!validatePuuid(puuid)) {
            throw new AppError(API_MESSAGES.ERROR.INVALID_PUUID, HTTP_STATUS.BAD_REQUEST);
        }
        logger.info(`Fetching player details for puuid: ${puuid}`);

        const playerStats = this.match.getPlayerStats(puuid);

        if(!playerStats)
        {
            logger.warn(`Player not found with PUUID: ${puuid}`);
            throw new AppError(API_MESSAGES.ERROR.PLAYER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        const detailedStats = this.match.getPlayerDetailedStats(puuid);

        logger.info(`Player details fetched successfully for puuid: ${playerStats.riotIdGameName}`);

        return{
            success: true,
            message: API_MESSAGES.SUCCESS.PLAYER_FOUND,
            data: detailedStats,
            meta: {
                matchId: this.match.matchId,
                retrievedAt: new Date().toISOString()
            }
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
    }
    logger.error('Error in getPlayerDetails:', error);
    throw new AppError(API_MESSAGES.ERROR.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
  async getPlayerComparison(puuid1, puuid2) {
    try {
        const player1 = await this.getPlayerDetails(puuid1);
        const player2 = await this.getPlayerDetails(puuid2);
        return {
            success: true,
            message: 'Player comparison get successfully',
            data: {
                player1: player1.data,
                player2: player2.data,
                comparison: this._comparePlayerStats(player1.data, player2.data)
            }
        };
    } catch (error) {
        logger.error('Error in getPlayerComparison:', error);
        throw error;
    }
}
    _comparePlayerStats(player1, player2){
        return{
            kills: player1.kills > player2.kills ? 'player1' :player1.kills < player2.kills ? 'player2' : 'tie',
            assists: player1.assists > player2.assists ? 'player1' : player1.assists < player2.assists ? 'player2': 'tie',
            damage: player1.totalDamageDealtToChampions > player2.totalDamageDealtToChampions ? 'player1' : 
                    player1.totalDamageDealtToChampions < player2.totalDamageDealtToChampions ? 'player2' : 'tie',
            killParticipation: player1.killParticipation > player2.killParticipation ? 'player1' : 
                               player1.killParticipation < player2.killParticipation ? 'player2' : 'tie',
        };
    }
}

module.exports = new PlayerService();