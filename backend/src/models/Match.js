const { GAME_CONSTANTS } = require('../utils/constants');
const { calculateKillParticipation, formatGameDuration } = require('../utils/calculations');
const logger = require('../utils/logger');

class Match {
  constructor(matchData) {
    this.rawData = matchData;
    this.matchId = matchData.metadata.matchId;
    this.gameDuration = matchData.info.gameDuration;
    this.gameVersion = matchData.info.gameVersion;
    this.queueId = matchData.info.queueId;
    this.mapId = matchData.info.mapId;
    this.participants = matchData.info.participants;
    this.teams = matchData.info.teams;
    
    logger.info(`Match model initialized for match: ${this.matchId}`);
  }


   // Get teams with basic information
  getTeams() {
    const team100 = {
      teamId: GAME_CONSTANTS.TEAM_IDS.BLUE,
      players: this.participants.filter(p => p.teamId === GAME_CONSTANTS.TEAM_IDS.BLUE),
      win: this.teams.find(t => t.teamId === GAME_CONSTANTS.TEAM_IDS.BLUE)?.win || false,
      objectives: this.teams.find(t => t.teamId === GAME_CONSTANTS.TEAM_IDS.BLUE)?.objectives || {}
    };

    const team200 = {
      teamId: GAME_CONSTANTS.TEAM_IDS.RED,
      players: this.participants.filter(p => p.teamId === GAME_CONSTANTS.TEAM_IDS.RED),
      win: this.teams.find(t => t.teamId === GAME_CONSTANTS.TEAM_IDS.RED)?.win || false,
      objectives: this.teams.find(t => t.teamId === GAME_CONSTANTS.TEAM_IDS.RED)?.objectives || {}
    };

    return { team100, team200 };
  }

   // Get comprehensive teams comparison
  getTeamsComparison(teams = null) {
    if (!teams) {
      teams = this.getTeams();
    }

    const formatTeamStats = (team) => {
      const totalKills = team.players.reduce((sum, p) => sum + p.kills, 0);
      const totalDeaths = team.players.reduce((sum, p) => sum + p.deaths, 0);
      const totalAssists = team.players.reduce((sum, p) => sum + p.assists, 0);
      const totalDamage = team.players.reduce((sum, p) => sum + p.totalDamageDealtToChampions, 0);
      const totalGold = team.players.reduce((sum, p) => sum + p.goldEarned, 0);

      return {
        ...team,
        stats: {
          totalKills,
          totalDeaths,
          totalAssists,
          totalDamage,
          totalGold,
          averageDamage: Math.round(totalDamage / team.players.length),
          averageGold: Math.round(totalGold / team.players.length),
          teamKDA: totalDeaths > 0 ? ((totalKills + totalAssists) / totalDeaths).toFixed(2) : 'Perfect'
        },
        players: team.players.map(player => this.formatPlayerStats(player, team.players))
      };
    };

    return {
      team100: formatTeamStats(teams.team100),
      team200: formatTeamStats(teams.team200),
      matchMetadata: {
        matchId: this.matchId,
        duration: formatGameDuration(this.gameDuration),
        durationSeconds: this.gameDuration,
        gameVersion: this.gameVersion,
        queueId: this.queueId,
        mapId: this.mapId
      }
    };
  }

  // Get match overview for main comparison page
  getMatchOverview() {
    const teams = this.getTeams();
    const comparison = this.getTeamsComparison(teams);
    
    return {
      matchId: this.matchId,
      gameDuration: this.gameDuration,
      formattedDuration: formatGameDuration(this.gameDuration),
      teams: [comparison.team100, comparison.team200],
      winningTeam: comparison.team100.win ? comparison.team100 : comparison.team200,
      metadata: comparison.matchMetadata
    };
  }

  // Get specific player statistics
  getPlayerStats(puuid) {
    return this.participants.find(p => p.puuid === puuid);
  }

  // Get detailed player statistics for MVP page
  getPlayerDetailedStats(puuid) {
    const playerStats = this.getPlayerStats(puuid);
    if (!playerStats) return null;

    const teams = this.getTeams();
    const playerTeam = playerStats.teamId === GAME_CONSTANTS.TEAM_IDS.BLUE ? teams.team100 : teams.team200;
    const enemyTeam = playerStats.teamId === GAME_CONSTANTS.TEAM_IDS.BLUE ? teams.team200 : teams.team100;
    
    const basicStats = this.formatPlayerStats(playerStats, playerTeam.players);
    
    // Enhanced stats for MVP page
    const enhancedStats = {
      ...basicStats,
      detailedStats: {
        // Combat Stats
        kda: playerStats.deaths > 0 
          ? ((playerStats.kills + playerStats.assists) / playerStats.deaths).toFixed(2)
          : 'Perfect',
        largestKillingSpree: playerStats.largestKillingSpree,
        largestMultiKill: playerStats.largestMultiKill,
        doubleKills: playerStats.doubleKills,
        tripleKills: playerStats.tripleKills,
        quadraKills: playerStats.quadraKills,
        pentaKills: playerStats.pentaKills,
        
        // Damage Stats
        totalDamageTaken: playerStats.totalDamageTaken,
        totalHeal: playerStats.totalHeal,
        totalDamageShieldedOnTeammates: playerStats.totalDamageShieldedOnTeammates,
        damagePerMinute: Math.round(playerStats.totalDamageDealtToChampions / (this.gameDuration / 60)),
        
        // Economy Stats
        goldPerMinute: Math.round(playerStats.goldEarned / (this.gameDuration / 60)),
        totalMinionsKilled: playerStats.totalMinionsKilled,
        neutralMinionsKilled: playerStats.neutralMinionsKilled,
        csPerMinute: ((playerStats.totalMinionsKilled + playerStats.neutralMinionsKilled) / (this.gameDuration / 60)).toFixed(1),
        
        // Vision Stats
        visionScore: playerStats.visionScore,
        wardsPlaced: playerStats.wardsPlaced,
        wardsKilled: playerStats.wardsKilled,
        visionWardsBought: playerStats.visionWardsBoughtInGame,
        
        // Objective Stats
        turretKills: playerStats.turretKills,
        inhibitorKills: playerStats.inhibitorKills,
        dragonKills: playerStats.dragonKills,
        baronKills: playerStats.baronKills,
        
        // Performance Metrics
        teamDamagePercentage: playerTeam.players.reduce((sum, p) => sum + p.totalDamageDealtToChampions, 0) > 0
          ? ((playerStats.totalDamageDealtToChampions / playerTeam.players.reduce((sum, p) => sum + p.totalDamageDealtToChampions, 0)) * 100).toFixed(1)
          : 0
      },
      
      // Team context
      teamStats: {
        teamId: playerTeam.teamId,
        teamWin: playerTeam.win,
        teamKills: playerTeam.players.reduce((sum, p) => sum + p.kills, 0),
        teamDeaths: playerTeam.players.reduce((sum, p) => sum + p.deaths, 0),
        teamAssists: playerTeam.players.reduce((sum, p) => sum + p.assists, 0)
      },
      
      // Match context
      matchContext: {
        matchId: this.matchId,
        gameDuration: this.gameDuration,
        formattedDuration: formatGameDuration(this.gameDuration),
        gameVersion: this.gameVersion,
        queueId: this.queueId
      }
    };

    return enhancedStats;
  }

  // Format player statistics with calculated fields
  formatPlayerStats(player, teamPlayers) {
    const totalTeamKills = teamPlayers.reduce((sum, p) => sum + p.kills, 0);
    const killParticipation = calculateKillParticipation(player.kills, player.assists, totalTeamKills);

    return {
      // Identity
      puuid: player.puuid,
      playerName: player.riotIdGameName || 'Unknown',
      tagline: player.riotIdTagline || '',
      fullName: `${player.riotIdGameName || 'Unknown'}#${player.riotIdTagline || ''}`,
      
      // Champion
      championName: player.championName,
      championId: player.championId,
      champLevel: player.champLevel,
      
      // Core Stats (Required by UI)
      kills: player.kills,
      deaths: player.deaths,
      assists: player.assists,
      totalDamageDealtToChampions: player.totalDamageDealtToChampions,
      killParticipation: parseFloat(killParticipation),
      
      // Additional Stats
      position: player.teamPosition || 'UNKNOWN',
      win: player.win,
      goldEarned: player.goldEarned,
      totalMinionsKilled: player.totalMinionsKilled,
      visionScore: player.visionScore,
      
      // Items
      items: [
        player.item0, player.item1, player.item2,
        player.item3, player.item4, player.item5, player.item6
      ].filter(item => item !== 0),
      
      // Calculated fields
      kda: player.deaths > 0 
        ? ((player.kills + player.assists) / player.deaths).toFixed(2)
        : 'Perfect',
      
      // Performance indicators
      isHighPerformer: killParticipation >= GAME_CONSTANTS.STATS_THRESHOLDS.HIGH_KILL_PARTICIPATION,
      isHighDamage: player.totalDamageDealtToChampions >= GAME_CONSTANTS.STATS_THRESHOLDS.HIGH_DAMAGE
    };
  }
}

module.exports = Match;