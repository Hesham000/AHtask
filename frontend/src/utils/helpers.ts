import { Player, Team} from '@/types/match';
import { TEAM_COLORS } from './constants';

// Debounce utility for expensive operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Memoization cache for expensive calculations
const memoCache = new Map<string, any>();

export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (memoCache.has(key)) {
      return memoCache.get(key);
    }
    
    const result = func(...args);
    memoCache.set(key, result);
    
    // Clear cache if it gets too large
    if (memoCache.size > 100) {
      const firstKey = memoCache.keys().next().value;
      if (firstKey !== undefined) {
        memoCache.delete(firstKey);
      }
    }
    
    return result;
  }) as T;
};

// Format large number with commas (memoized)
export const formatNumber = memoize((num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}, (num) => `formatNumber_${num}`);

//Get team color (memoized)
export const getTeamColor = memoize((teamIdOrTeam: number | Team) => {
    const teamId = typeof teamIdOrTeam === 'number' ? teamIdOrTeam : teamIdOrTeam.teamId;
    return TEAM_COLORS[teamId as keyof typeof TEAM_COLORS];
}, (teamIdOrTeam) => `teamColor_${typeof teamIdOrTeam === 'number' ? teamIdOrTeam : teamIdOrTeam.teamId}`);

//Calc the KDA (memoized)
export const calculateKDA = memoize((kills: number, death: number, assists: number) : string => {
    if (death === 0) return 'Perfect'
    return ((kills + assists) / death).toFixed(2);
}, (kills, death, assists) => `kda_${kills}_${death}_${assists}`);

//Get performance tier KDA (memoized)
export const getPerformanceTier = memoize((player: Player): string => {
    const kda = player.deaths > 0 ? (player.kills + player.assists) / player.deaths :  999;
    const participation = player.killParticipation;
    if(participation >= 80 && kda >= 3) return 'S+';
    if(participation >= 70 && kda >= 2.5) return 'S';
    if (participation >= 60 && kda >= 2) return 'A';
    if (participation >= 50 && kda >= 1.5) return 'B';
    if (participation >= 40 && kda >= 1) return 'C';
    return 'D';
}, (player) => `performance_${player.kills}_${player.deaths}_${player.assists}_${player.killParticipation}`);

//Get MVP candidate (memoized)
export const getMVPCandidate = memoize((players: Player[]): Player => {
    return players.reduce((mvp, player) => {
        const playerScore = player.killParticipation + (player.kills * 3) + (player.assists * 1.5);
        const mvpScore = mvp.killParticipation + (mvp.kills * 3) + (mvp.assists * 1.5);
        return playerScore > mvpScore ? player: mvp;
    })
}, (players) => `mvp_${players.map(p => `${p.puuid}_${p.kills}_${p.assists}_${p.killParticipation}`).join('_')}`);

// Game duration format (memoized)
export const formatDuration = memoize((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}, (seconds) => `duration_${seconds}`);

// Get champion image url (memoized)
export const getChampionImageUrl = memoize((championName: string): string => {
    return `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${championName}.png`;
}, (championName) => `champion_${championName}`);

//Sort players by performance (memoized)
export const sortPlayersByPerformance = memoize(( players: Player[]): Player[] => {
    return [...players].sort((a, b) => {
        //Primary sort by kill participation
        if(b.killParticipation !== a.killParticipation) return b.killParticipation - a.killParticipation;
        //Secondary sort by kda
        const aKDA = a.deaths > 0 ? (a.kills + a.assists) / a.deaths : 999;
        const bKDA = b.deaths > 0 ? (b.kills + b.assists) / b.deaths : 999;
        if (bKDA !== aKDA) return bKDA - aKDA;
        //Tertiary damage dealt
        return b.totalDamageDealtToChampions - a.totalDamageDealtToChampions;
    })
}, (players) => `sort_${players.map(p => `${p.puuid}_${p.killParticipation}_${p.kills}_${p.deaths}_${p.assists}_${p.totalDamageDealtToChampions}`).join('_')}`);

// Clear memoization cache (useful for development or memory management)
export const clearMemoCache = () => {
    memoCache.clear();
};