export interface Player {
    puuid: string;
    playerName: string;
    tagline: string;
    fullName: string;
    championName: string;
    championId: number;
    champLevel: number;
    kills: number;
    deaths: number;
    assists: number;
    totalDamageDealtToChampions: number;
    killParticipation: number;
    position: string;
    win: boolean;
    goldEarned: number;
    totalMinionsKilled: number;
    visionScore: number;
    items: number[];
    kda: string;
    isHighPerformer: boolean;
    isHighDamage: boolean;
  }
  
  export interface DetailedPlayer extends Player {
    detailedStats: {
      kda: string;
      largestKillingSpree: number;
      largestMultiKill: number;
      doubleKills: number;
      tripleKills: number;
      quadraKills: number;
      pentaKills: number;
      totalDamageTaken: number;
      totalHeal: number;
      totalDamageShieldedOnTeammates: number;
      damagePerMinute: number;
      goldPerMinute: number;
      totalMinionsKilled: number;
      neutralMinionsKilled: number;
      csPerMinute: string;
      visionScore: number;
      wardsPlaced: number;
      wardsKilled: number;
      visionWardsBought: number;
      turretKills: number;
      inhibitorKills: number;
      dragonKills: number;
      baronKills: number;
      teamDamagePercentage: string;
    };
    teamStats: {
      teamId: number;
      teamWin: boolean;
      teamKills: number;
      teamDeaths: number;
      teamAssists: number;
    };
    matchContext: {
      matchId: string;
      gameDuration: number;
      formattedDuration: string;
      gameVersion: string;
      queueId: number;
    };
  }
  
  export interface TeamStats {
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    totalDamage: number;
    totalGold: number;
    averageDamage: number;
    averageGold: number;
    teamKDA: string;
  }
  
  export interface Team {
    teamId: number;
    players: Player[];
    win: boolean;
    objectives?: any;
    stats: TeamStats;
  }
  
  export interface MatchOverview {
    matchId: string;
    gameDuration: number;
    formattedDuration: string;
    teams: Team[];
    winningTeam: Team;
    metadata: {
      matchId: string;
      duration: string;
      durationSeconds: number;
      gameVersion: string;
      queueId: number;
      mapId: number;
    };
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: any;
  }