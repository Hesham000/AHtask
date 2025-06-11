const GAME_CONSTANTS = {
    TEAM_IDS: {
        BLUE: 100,
        RED: 200,
    },

    POSITIONS: {
        TOP: 'TOP',
        JUNGLE: 'JUNGLE',
        MIDDLE: 'MIDDLE',
        BOTTOM: 'BOTTOM',
        UTILITY: 'UTILITY',
    },

    STATS_THRESHOLDS: {
        HIGH_KILL_PARTICIPATION: 70,
        HIGH_DAMAGE: 2000,
        PERFECT_KDA_DEATHS: 0,
    }
};

const API_MESSAGES = {
    SUCCESS: {
      MATCH_FOUND: 'Match data retrieved successfully',
      PLAYER_FOUND: 'Player data retrieved successfully'
    },
    ERROR: {
      MATCH_NOT_FOUND: 'Match not found',
      PLAYER_NOT_FOUND: 'Player not found',
      INVALID_PUUID: 'Invalid player UUID provided',
      SERVER_ERROR: 'Internal server error occurred'
    }
  };
  
  const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  };
  
  module.exports = {
    GAME_CONSTANTS,
    API_MESSAGES,
    HTTP_STATUS
  };