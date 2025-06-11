import React from 'react';
import { motion } from 'framer-motion';
import { Team } from '@/types/match';
import { Trophy, Crown, Swords, Zap, Sparkles } from 'lucide-react';

interface WinnerBannerProps {
  winningTeam: Team;
}

const WinnerBanner: React.FC<WinnerBannerProps> = ({ winningTeam }) => {
  const isBlueTeam = winningTeam.teamId === 100;
  
  const bannerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: -50 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 1,
        ease: "easeOut",
        type: "spring",
        damping: 15
      }
    }
  };

  const crownVariants = {
    hidden: { opacity: 0, rotate: -180, scale: 0 },
    visible: { 
      opacity: 1, 
      rotate: 0, 
      scale: 1,
      transition: { 
        delay: 0.5,
        duration: 0.8,
        type: "spring",
        damping: 12
      }
    }
  };

  const sparkleVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        `0 0 30px ${isBlueTeam ? 'rgba(59, 130, 246, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
        `0 0 60px ${isBlueTeam ? 'rgba(59, 130, 246, 0.8)' : 'rgba(239, 68, 68, 0.8)'}`,
        `0 0 30px ${isBlueTeam ? 'rgba(59, 130, 246, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="relative overflow-hidden"
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent"></div>
      <div className={`absolute inset-0 bg-gradient-to-r ${isBlueTeam ? 'from-blue-900/20 via-transparent to-blue-900/20' : 'from-red-900/20 via-transparent to-red-900/20'}`}></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 ${isBlueTeam ? 'bg-blue-400' : 'bg-red-400'} rounded-full opacity-60`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0.6, 0],
              scale: [1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        className={`lol-card p-8 border-4 ${isBlueTeam ? 'border-blue-400/50 team-blue' : 'border-red-400/50 team-red'} relative`}
        variants={glowVariants}
        animate="animate"
      >
        {/* Victory Header */}
        <div className="text-center space-y-4">
          {/* Crown and Victory Text */}
          <div className="flex items-center justify-center space-x-4">
            <motion.div variants={sparkleVariants} animate="animate">
              <Sparkles className="h-8 w-8 text-amber-400" />
            </motion.div>
            
            <motion.div variants={crownVariants}>
              <Crown className="h-16 w-16 text-amber-400 filter drop-shadow-lg" />
            </motion.div>
            
            <motion.div variants={sparkleVariants} animate="animate">
              <Sparkles className="h-8 w-8 text-amber-400" />
            </motion.div>
          </div>

          {/* Victory Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 mb-2 tracking-wider">
              VICTORY
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4"></div>
          </motion.div>

          {/* Team Information */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="space-y-3"
          >
            <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full border-2 ${isBlueTeam ? 'border-blue-400 bg-blue-950/50' : 'border-red-400 bg-red-950/50'}`}>
              <div className={`w-6 h-6 ${isBlueTeam ? 'bg-blue-500' : 'bg-red-500'} hexagon`}></div>
              <span className={`text-2xl font-bold ${isBlueTeam ? 'text-blue-300' : 'text-red-300'}`}>
                {isBlueTeam ? 'BLUE SIDE' : 'RED SIDE'} TRIUMPHS
              </span>
              <div className={`w-6 h-6 ${isBlueTeam ? 'bg-blue-500' : 'bg-red-500'} hexagon`}></div>
            </div>

            <p className="text-slate-300 text-lg">
              Dominating the Rift with superior strategy and teamwork
            </p>
          </motion.div>

          {/* Team Stats Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-6"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Swords className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400">
                {winningTeam.stats.totalKills}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Kills</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {(winningTeam.stats.totalDamage / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Damage</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-400">
                {winningTeam.stats.teamKDA}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">KDA</div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Border Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent ${isBlueTeam ? 'via-blue-400' : 'via-red-400'} to-transparent`}></div>
        <div className={`absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent ${isBlueTeam ? 'via-blue-400' : 'via-red-400'} to-transparent`}></div>
      </motion.div>
    </motion.div>
  );
};

export default WinnerBanner;
