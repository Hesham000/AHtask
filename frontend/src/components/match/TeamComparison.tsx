import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MatchOverview, Player } from '@/types/match';
import PlayerCard from './PlayerCard';
import WinnerBanner from './WinnerBanner';
import { Swords, Shield, Users, Trophy, Zap, Target } from 'lucide-react';

interface TeamComparisonProps {
  matchData: MatchOverview;
}

// Static animation variants to prevent re-creation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const teamVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const battleStatsVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, delay: 0.2 }
};

const teamHeaderHover = { scale: 1.02 };
const hoverBgColor = "rgba(30, 41, 59, 0.5)";

// Memoized StatComparison component
const StatComparison = React.memo<{ 
  label: string; 
  team1Value: number; 
  team2Value: number; 
  icon: any; 
  color: string;
}>(({ label, team1Value, team2Value, icon: Icon, color }) => {
  const team1Higher = team1Value > team2Value;
  const team2Higher = team2Value > team1Value;
  
  const formatNumber = useCallback((num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }, []);
  
  const team1Text = useMemo(() => formatNumber(team1Value), [team1Value, formatNumber]);
  const team2Text = useMemo(() => formatNumber(team2Value), [team2Value, formatNumber]);
  
  const team1ClassName = useMemo(() => 
    `flex items-center space-x-2 ${team1Higher ? 'text-blue-400 font-bold' : 'text-slate-400'}`,
    [team1Higher]
  );
  
  const team2ClassName = useMemo(() => 
    `flex items-center space-x-2 ${team2Higher ? 'text-red-400 font-bold' : 'text-slate-400'}`,
    [team2Higher]
  );
  
  return (
    <motion.div 
      className="flex items-center justify-between py-3 px-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
      whileHover={{ backgroundColor: hoverBgColor }}
    >
      <div className={team1ClassName}>
        <span className="text-lg">{team1Text}</span>
      </div>
      
      <div className="flex items-center space-x-2 text-slate-300">
        <Icon className={`h-5 w-5 ${color}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      
      <div className={team2ClassName}>
        <span className="text-lg">{team2Text}</span>
      </div>
    </motion.div>
  );
});

StatComparison.displayName = 'StatComparison';

const TeamComparison: React.FC<TeamComparisonProps> = React.memo(({ matchData }) => {
  const team1 = matchData.teams[0];
  const team2 = matchData.teams[1];
  
  // Memoize expensive calculations
  const team1Stats = useMemo(() => ({
    totalKills: team1.players.reduce((sum: number, p: Player) => sum + p.kills, 0),
    totalDeaths: team1.players.reduce((sum: number, p: Player) => sum + p.deaths, 0),
    totalAssists: team1.players.reduce((sum: number, p: Player) => sum + p.assists, 0),
    totalDamage: team1.players.reduce((sum: number, p: Player) => sum + p.totalDamageDealtToChampions, 0),
    totalGold: team1.players.reduce((sum: number, p: Player) => sum + p.goldEarned, 0)
  }), [team1.players]);
  
  const team2Stats = useMemo(() => ({
    totalKills: team2.players.reduce((sum: number, p: Player) => sum + p.kills, 0),
    totalDeaths: team2.players.reduce((sum: number, p: Player) => sum + p.deaths, 0),
    totalAssists: team2.players.reduce((sum: number, p: Player) => sum + p.assists, 0),
    totalDamage: team2.players.reduce((sum: number, p: Player) => sum + p.totalDamageDealtToChampions, 0),
    totalGold: team2.players.reduce((sum: number, p: Player) => sum + p.goldEarned, 0)
  }), [team2.players]);

  // Memoize player cards with proper keys
  const team1PlayerCards = useMemo(() => 
    team1.players.map((player, index) => (
      <motion.div
        key={player.puuid}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 + index * 0.1 }}
      >
        <PlayerCard 
          player={player} 
          teamId={team1.teamId}
          isTopPerformer={player.isHighPerformer}
        />
      </motion.div>
    )), [team1.players, team1.teamId]);

  const team2PlayerCards = useMemo(() => 
    team2.players.map((player, index) => (
      <motion.div
        key={player.puuid}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 + index * 0.1 }}
      >
        <PlayerCard 
          player={player} 
          teamId={team2.teamId}
          isTopPerformer={player.isHighPerformer}
        />
      </motion.div>
    )), [team2.players, team2.teamId]);

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Winner Banner */}
      <WinnerBanner winningTeam={matchData.winningTeam} />

      {/* Rift Showdown Header */}
      <motion.div 
        className="text-center py-8 lol-card border-amber-500/30"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Swords className="h-8 w-8 text-red-400" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-red-400">
            RIFT SHOWDOWN
          </h1>
          
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="h-8 w-8 text-blue-400" />
          </motion.div>
        </div>
        <p className="text-lg text-slate-400 font-medium">
          Champions clash in the ultimate battle for supremacy
        </p>
      </motion.div>

      {/* Battle Statistics Panel */}
      <motion.div 
        className="lol-card border-amber-500/30 p-6 mb-8"
        {...battleStatsVariants}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-2">
            BATTLE STATISTICS
          </h2>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="font-semibold">BLUE SIDE</span>
            </div>
            <Trophy className="h-5 w-5 text-amber-400" />
            <div className="flex items-center space-x-2 text-red-400">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="font-semibold">RED SIDE</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <StatComparison 
            label="KILLS" 
            team1Value={team1Stats.totalKills} 
            team2Value={team2Stats.totalKills}
            icon={Target}
            color="text-green-400"
          />
          <StatComparison 
            label="DEATHS" 
            team1Value={team1Stats.totalDeaths} 
            team2Value={team2Stats.totalDeaths}
            icon={Swords}
            color="text-red-400"
          />
          <StatComparison 
            label="ASSISTS" 
            team1Value={team1Stats.totalAssists} 
            team2Value={team2Stats.totalAssists}
            icon={Users}
            color="text-blue-400"
          />
          <StatComparison 
            label="DAMAGE" 
            team1Value={team1Stats.totalDamage} 
            team2Value={team2Stats.totalDamage}
            icon={Zap}
            color="text-purple-400"
          />
        </div>
      </motion.div>

      {/* Teams Display */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Team 1 (Blue Side) */}
        <motion.div 
          variants={teamVariants}
          className="space-y-6"
        >
          <motion.div 
            className="text-center py-4 lol-card team-blue"
            whileHover={teamHeaderHover}
          >
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-6 h-6 bg-blue-500 hexagon"></div>
              <h2 className="text-2xl font-bold text-blue-300">BLUE SIDE</h2>
              <div className="w-6 h-6 bg-blue-500 hexagon"></div>
            </div>
            <p className="text-blue-400 text-sm font-medium">
              {team1Stats.totalKills} / {team1Stats.totalDeaths} / {team1Stats.totalAssists}
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {team1PlayerCards}
          </div>
        </motion.div>

        {/* Team 2 (Red Side) */}
        <motion.div 
          variants={teamVariants}
          className="space-y-6"
        >
          <motion.div 
            className="text-center py-4 lol-card team-red"
            whileHover={teamHeaderHover}
          >
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-6 h-6 bg-red-500 hexagon"></div>
              <h2 className="text-2xl font-bold text-red-300">RED SIDE</h2>
              <div className="w-6 h-6 bg-red-500 hexagon"></div>
            </div>
            <p className="text-red-400 text-sm font-medium">
              {team2Stats.totalKills} / {team2Stats.totalDeaths} / {team2Stats.totalAssists}
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {team2PlayerCards}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

TeamComparison.displayName = 'TeamComparison';

export default TeamComparison;
