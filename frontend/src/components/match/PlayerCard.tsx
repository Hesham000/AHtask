import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types/match';
import { formatNumber, getPerformanceTier } from '@/utils/helpers';
import { POSITION_ICONS } from '@/utils/constants';
import { 
  Crown, 
  Zap, 
  Target, 
  TrendingUp, 
  Sword,  
  Coins,
  Star
} from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  teamId: number;
  isTopPerformer?: boolean;
}

// Static objects to prevent re-creation on each render
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: { 
    y: -5, 
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

const championVariants = {
  hover: { 
    scale: 1.1, 
    rotate: 2,
    transition: { duration: 0.3 }
  }
};

const crownAnimation = {
  rotate: [0, 10, -10, 0]
};

const crownTransition = {
  duration: 2, 
  repeat: Infinity
};

const highPerformerAnimation = {
  scale: [1, 1.1, 1]
};

const highPerformerTransition = {
  duration: 1.5, 
  repeat: Infinity
};

const hoverBgColor = "rgba(30, 41, 59, 0.5)";

// Performance tier mapping - static object
const tierClassMap: Record<string, string> = {
  'S+': 'performance-s',
  'S': 'performance-s',
  'A': 'performance-a',
  'B': 'performance-b',
  'C': 'performance-c',
  'D': 'performance-d'
};

const PlayerCard: React.FC<PlayerCardProps> = React.memo(({ player, teamId, isTopPerformer = false }) => {
  const navigate = useNavigate();
  
  // Memoize expensive calculations
  const performanceTier = useMemo(() => getPerformanceTier(player), [player]);
  
  const performanceClass = useMemo(() => 
    tierClassMap[performanceTier] || 'performance-c',
    [performanceTier]
  );
  
  const formattedDamage = useMemo(() => 
    formatNumber(player.totalDamageDealtToChampions),
    [player.totalDamageDealtToChampions]
  );
  
  const formattedGold = useMemo(() => 
    formatNumber(player.goldEarned),
    [player.goldEarned]
  );
  
  const isBlueTeam = useMemo(() => teamId === 100, [teamId]);
  
  const teamClass = useMemo(() => 
    isBlueTeam ? 'team-blue' : 'team-red',
    [isBlueTeam]
  );
  
  const cardClassName = useMemo(() => 
    `lol-card ${teamClass} ${isTopPerformer ? 'winner-glow' : ''} relative overflow-hidden border-2`,
    [teamClass, isTopPerformer]
  );
  
  const animationDelay = useMemo(() => 
    `${Math.random() * 2}s`,
    []
  );
  
  // Use fallback images array with different versions and sources
  const championImageSources = useMemo(() => [
    `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${player.championName}.png`,
    `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${player.championName}.png`,
    `https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${player.championName}.png`,
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.championId}.png`
  ], [player.championName, player.championId]);

  // Memoize callbacks
  const handleMVPClick = useCallback(() => {
    navigate(`/mvp/${player.puuid}`);
  }, [navigate, player.puuid]);

  const handleChampionError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    const currentIndex = championImageSources.findIndex(src => src === currentSrc);
    
    if (currentIndex < championImageSources.length - 1) {
      img.src = championImageSources[currentIndex + 1];
    } else {
      // Show placeholder with champion name initial
      img.style.display = 'none';
      const placeholder = img.nextElementSibling as HTMLElement;
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    }
  }, [championImageSources]);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="floating-animation"
      style={{ animationDelay }}
    >
      <Card className={cardClassName}>
        {/* Top Performer Crown */}
        {isTopPerformer && (
          <motion.div 
            className="absolute -top-2 -right-2 z-10"
            animate={crownAnimation}
            transition={crownTransition}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
              <Crown className="h-5 w-5 text-slate-900" />
            </div>
          </motion.div>
        )}

        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-amber-500/5"></div>
        
        <CardContent className="p-6 relative">
          {/* Champion Portrait Section */}
          <div className="flex items-center space-x-4 mb-4">
            <motion.div
              className="relative champion-portrait"
              variants={championVariants}
              whileHover="hover"
            >
              <img
                src={championImageSources[0]}
                alt={player.championName}
                className="w-16 h-16 rounded-full border-3 border-amber-400/50 object-cover shadow-lg"
                onError={handleChampionError}
              />
              {/* Fallback placeholder */}
              <div 
                className="w-16 h-16 rounded-full border-3 border-amber-400/50 bg-slate-700 flex items-center justify-center text-amber-400 font-bold text-xl shadow-lg"
                style={{ display: 'none' }}
              >
                {player.championName[0]}
              </div>
              
              {/* Champion Level Badge */}
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-slate-900">
                {player.champLevel}
              </div>
            </motion.div>
            
            <div className="flex-1 min-w-0">
                             <h3 className="font-bold text-slate-100 text-lg truncate">
                 {player.playerName}
               </h3>
               <div className="flex items-center space-x-2">
                 <div className="flex items-center space-x-1">
                   <span className="text-amber-400 text-sm">
                     {POSITION_ICONS[player.position as keyof typeof POSITION_ICONS] || POSITION_ICONS.UNKNOWN}
                   </span>
                   <span className="text-sm text-slate-400 font-medium">
                     {player.position}
                   </span>
                 </div>
                 <span className="text-slate-600">•</span>
                 <span className="text-sm text-slate-400 font-medium">
                   {player.championName}
                 </span>
               </div>
            </div>
          </div>

          {/* Performance Badges */}
          <div className="flex items-center justify-between mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge className={`${performanceClass} px-3 py-1 font-bold text-sm`}>
                <Star className="h-3 w-3 mr-1" />
                {performanceTier} TIER
              </Badge>
            </motion.div>
            
            {player.isHighPerformer && (
              <motion.div
                animate={highPerformerAnimation}
                transition={highPerformerTransition}
              >
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  HIGH PERFORMER
                </Badge>
              </motion.div>
            )}
          </div>

          {/* KDA Section */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <span className="text-2xl font-bold text-green-400">{player.kills}</span>
              <span className="text-slate-500">/</span>
              <span className="text-2xl font-bold text-red-400">{player.deaths}</span>
              <span className="text-slate-500">/</span>
              <span className="text-2xl font-bold text-blue-400">{player.assists}</span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-slate-300 font-medium">KDA: {player.kda}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-3 mb-6">
            <motion.div 
              className="flex justify-between items-center p-2 rounded-lg bg-slate-800/30 border border-slate-700/30"
              whileHover={{ backgroundColor: hoverBgColor }}
            >
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">Kill Participation</span>
              </div>
              <span className="font-bold stat-highlight text-lg">{player.killParticipation}%</span>
            </motion.div>
            
            <motion.div 
              className="flex justify-between items-center p-2 rounded-lg bg-slate-800/30 border border-slate-700/30"
              whileHover={{ backgroundColor: hoverBgColor }}
            >
              <div className="flex items-center space-x-2">
                <Sword className="h-4 w-4 text-red-400" />
                <span className="text-sm text-slate-300">Damage</span>
              </div>
              <span className="font-semibold text-red-400 text-lg">
                {formattedDamage}
              </span>
            </motion.div>
            
            <motion.div 
              className="flex justify-between items-center p-2 rounded-lg bg-slate-800/30 border border-slate-700/30"
              whileHover={{ backgroundColor: hoverBgColor }}
            >
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-slate-300">Gold</span>
              </div>
              <span className="font-semibold text-yellow-400 text-lg">
                {formattedGold}
              </span>
            </motion.div>
          </div>

          {/* MVP Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleMVPClick}
              className="w-full lol-button text-sm"
            >
              <Target className="h-4 w-4 mr-2" />
              View MVP Stats
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

PlayerCard.displayName = 'PlayerCard';

export default PlayerCard;
