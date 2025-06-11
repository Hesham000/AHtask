import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlayer } from '@/hooks/usePlayer';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Crown, 
  Zap, 
  Target, 
  Sword, 
  Eye, 
  Coins,
  Star,
  Trophy,
  Sparkles,
  Users,
  Award
} from 'lucide-react';
import { getPerformanceTier } from '@/utils/helpers';
import { POSITION_ICONS } from '@/utils/constants';

const MVP: React.FC = () => {
  const { puuid } = useParams<{ puuid: string }>();
  const navigate = useNavigate();
  const { player, loading, error } = usePlayer(puuid!);

  // Fix scroll position when navigating to MVP page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !player) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 text-center max-w-md">
            <CardContent>
              <Crown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-600 mb-2">Player Not Found</h2>
              <p className="text-gray-600 mb-6">{error || 'Could not load player data'}</p>
              <Button onClick={() => navigate('/')} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Match</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const performanceTier = getPerformanceTier(player);

  const getPerformanceClass = (tier: string) => {
    const tierMap: { [key: string]: string } = {
      'S+': 'performance-s',
      'S': 'performance-s',
      'A': 'performance-a',
      'B': 'performance-b',
      'C': 'performance-c',
      'D': 'performance-d'
    };
    return tierMap[tier] || 'performance-c';
  };

  const isBlueTeam = player.teamStats.teamId === 100;

  return (
    <Layout>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.div variants={cardVariants}>
          <Button 
            onClick={() => navigate('/')} 
            className="lol-button text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Battle
          </Button>
        </motion.div>

        {/* Hero Section */}
        <motion.div variants={heroVariants}>
          <Card className="lol-card border-amber-500/50 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5"></div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-400 rounded-full opacity-40"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -50],
                    opacity: [0.4, 0],
                    scale: [1, 0.5]
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <CardContent className="p-8 relative z-10">
              <div className="text-center space-y-6">
                {/* MVP Crown */}
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <Crown className="h-20 w-20 text-amber-400 filter drop-shadow-lg" />
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-6 w-6 text-yellow-300" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Player Title */}
                <div className="space-y-2">
                  <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 tracking-wider">
                    MVP ANALYSIS
                  </h1>
                  <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
                </div>

                {/* Player Info */}
                <div className="flex items-center justify-center space-x-6">
                  <div className="champion-portrait w-20 h-20 bg-slate-700 rounded-xl flex items-center justify-center relative">
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${player.championName}.png`}
                      alt={player.championName}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try alternative champion name formats
                        const altSources = [
                          `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${player.championName}.png`,
                          `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${player.championName}.png`,
                          `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.championId}.png`
                        ];
                        
                        let currentIndex = parseInt(target.dataset.attempt || '0');
                        if (currentIndex < altSources.length) {
                          target.dataset.attempt = (currentIndex + 1).toString();
                          target.src = altSources[currentIndex];
                        } else {
                          // All sources failed, show placeholder
                          target.style.display = 'none';
                          target.parentElement!.style.backgroundColor = '#374151';
                          target.parentElement!.innerHTML = `<div style="width:64px;height:64px;display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:18px;font-weight:bold;">${player.championName.charAt(0)}</div>`;
                        }
                      }}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-900">
                      {player.champLevel}
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-slate-100 mb-1">{player.playerName}</h2>
                    <div className="flex items-center space-x-3 text-slate-400">
                      <span className="text-2xl">{POSITION_ICONS[player.position as keyof typeof POSITION_ICONS]}</span>
                      <span className="text-lg font-semibold text-amber-400">{player.championName}</span>
                      <span>•</span>
                      <span className={`font-medium ${isBlueTeam ? 'text-blue-400' : 'text-red-400'}`}>
                        {isBlueTeam ? 'BLUE SIDE' : 'RED SIDE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Tier */}
                <div className="flex justify-center">
                  <Badge className={`${getPerformanceClass(performanceTier)} px-6 py-2 text-lg font-bold`}>
                    <Star className="h-5 w-5 mr-2" />
                    {performanceTier} TIER PERFORMANCE
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Core Stats */}
        <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="lol-card border-green-500/30">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">K/D/A</h3>
              <p className="text-3xl font-bold text-slate-100 mb-2">
                <span className="text-green-400">{player.kills}</span>/
                <span className="text-red-400">{player.deaths}</span>/
                <span className="text-blue-400">{player.assists}</span>
              </p>
              <p className="text-sm text-slate-400">KDA Ratio: {player.kda}</p>
            </CardContent>
          </Card>

          <Card className="lol-card border-purple-500/30">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Kill Participation</h3>
              <p className="text-3xl font-bold text-purple-400 mb-2">{player.killParticipation}%</p>
              <p className="text-sm text-slate-400">Team Impact</p>
            </CardContent>
          </Card>

          <Card className="lol-card border-amber-500/30">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <Sword className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Damage</h3>
              <p className="text-3xl font-bold text-red-400 mb-2">
                {(player.totalDamageDealtToChampions / 1000).toFixed(1)}K
              </p>
              <p className="text-sm text-slate-400">Champions</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Stats */}
        <motion.div variants={cardVariants}>
          <Card className="lol-card">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                <Award className="h-6 w-6 inline mr-2" />
                DETAILED STATISTICS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Combat Stats */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-amber-400 border-b border-amber-400/30 pb-2">
                    <Sword className="h-5 w-5 inline mr-2" />
                    COMBAT
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Largest Killing Spree</span>
                      <span className="font-semibold text-slate-200">{player.detailedStats.largestKillingSpree}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Largest Multi Kill</span>
                      <span className="font-semibold text-slate-200">{player.detailedStats.largestMultiKill}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Double Kills</span>
                      <span className="font-semibold text-green-400">{player.detailedStats.doubleKills}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Triple Kills</span>
                      <span className="font-semibold text-blue-400">{player.detailedStats.tripleKills}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quadra Kills</span>
                      <span className="font-semibold text-purple-400">{player.detailedStats.quadraKills}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Penta Kills</span>
                      <span className="font-semibold text-amber-400">{player.detailedStats.pentaKills}</span>
                    </div>
                  </div>
                </div>

                {/* Economy Stats */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-yellow-400 border-b border-yellow-400/30 pb-2">
                    <Coins className="h-5 w-5 inline mr-2" />
                    ECONOMY
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gold Earned</span>
                      <span className="font-semibold text-yellow-400">{player.goldEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gold Per Minute</span>
                      <span className="font-semibold text-slate-200">{player.detailedStats.goldPerMinute}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">CS Total</span>
                      <span className="font-semibold text-slate-200">{player.detailedStats.totalMinionsKilled + player.detailedStats.neutralMinionsKilled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">CS Per Minute</span>
                      <span className="font-semibold text-slate-200">{player.detailedStats.csPerMinute}</span>
                    </div>
                  </div>
                </div>

                {/* Vision Stats */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-400 border-b border-purple-400/30 pb-2">
                    <Eye className="h-5 w-5 inline mr-2" />
                    VISION
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vision Score</span>
                      <span className="font-semibold text-purple-400">{player.detailedStats.visionScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Wards Placed</span>
                      <span className="font-semibold text-slate-200">{player.detailedStats.wardsPlaced}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Wards Destroyed</span>
                      <span className="font-semibold text-slate-200">{player.detailedStats.wardsKilled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Control Wards</span>
                      <span className="font-semibold text-slate-200">{player.detailedStats.visionWardsBought}</span>
                    </div>
                  </div>
                </div>

                {/* Objectives Stats */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-red-400 border-b border-red-400/30 pb-2">
                    <Trophy className="h-5 w-5 inline mr-2" />
                    OBJECTIVES
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Turrets</span>
                      <span className="font-semibold text-red-400">{player.detailedStats.turretKills}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Inhibitors</span>
                      <span className="font-semibold text-red-400">{player.detailedStats.inhibitorKills}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dragons</span>
                      <span className="font-semibold text-orange-400">{player.detailedStats.dragonKills}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Barons</span>
                      <span className="font-semibold text-purple-400">{player.detailedStats.baronKills}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Context */}
        <motion.div variants={cardVariants}>
          <Card className={`lol-card ${isBlueTeam ? 'border-blue-500/30' : 'border-red-500/30'}`}>
            <CardHeader className="text-center">
              <CardTitle className={`text-xl font-bold ${isBlueTeam ? 'text-blue-400' : 'text-red-400'}`}>
                <Users className="h-5 w-5 inline mr-2" />
                TEAM PERFORMANCE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="text-lg font-semibold text-slate-300 mb-2">Team Result</h4>
                  <Badge className={`${player.teamStats.teamWin ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-2`}>
                    {player.teamStats.teamWin ? 'VICTORY' : 'DEFEAT'}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-300 mb-2">Team K/D/A</h4>
                  <p className="text-xl font-bold text-slate-100">
                    {player.teamStats.teamKills}/{player.teamStats.teamDeaths}/{player.teamStats.teamAssists}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-300 mb-2">Damage Share</h4>
                  <p className="text-xl font-bold text-purple-400">
                    {player.detailedStats.teamDamagePercentage}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default MVP; 