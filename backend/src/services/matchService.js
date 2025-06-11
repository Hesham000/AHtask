const Match = require('../models/Match');
const { AppError } = require('../middleware/errorHandler');
const { API_MESSAGES, HTTP_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');
const matchData = require('../data/GAME_NA1_5299363459.json');

class MatchService {
  constructor() {
    this.match = new Match(matchData);
    logger.info('MatchService initialized with match data');
  }

  async getMatchOverview() {
    try {
      logger.info(`Fetching match overview for match ID: ${this.match.matchId}`);
      
      const overview = this.match.getMatchOverview();
      
      logger.info('Match overview retrieved successfully');
      return {
        success: true,
        message: API_MESSAGES.SUCCESS.MATCH_FOUND,
        data: overview,
        meta: {
          totalPlayers: overview.teams.reduce((sum, team) => sum + team.players.length, 0),
          winningTeam: overview.teams.find(team => team.win)?.teamId || null
        }
      };
    } catch (error) {
      logger.error('Error in getMatchOverview:', error);
      throw new AppError(API_MESSAGES.ERROR.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getTeamsComparison() {
    try {
      logger.info('Fetching teams comparison data');
      
      const teams = this.match.getTeams();
      const comparison = this.match.getTeamsComparison(teams);
      
      logger.info('Teams comparison data retrieved successfully');
      return {
        success: true,
        message: 'Teams comparison retrieved successfully',
        data: comparison,
        meta: {
          matchDuration: this.match.gameDuration,
          totalKills: comparison.team100.totalKills + comparison.team200.totalKills
        }
      };
    } catch (error) {
      logger.error('Error in getTeamsComparison:', error);
      throw new AppError(API_MESSAGES.ERROR.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getMatchMetadata() {
    try {
      return {
        success: true,
        data: {
          matchId: this.match.matchId,
          gameDuration: this.match.gameDuration,
          gameVersion: this.match.gameVersion,
          queueId: this.match.queueId,
          mapId: this.match.mapId
        }
      };
    } catch (error) {
      logger.error('Error in getMatchMetadata:', error);
      throw new AppError(API_MESSAGES.ERROR.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new MatchService();