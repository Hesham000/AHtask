import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sword, Shield, Crown, Sparkles, Cpu, Gamepad2 } from 'lucide-react';

// Static animation variants to prevent re-creation
const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const logoVariants = {
  hover: { 
    scale: 1.05,
    rotate: [0, -2, 2, 0],
    transition: { duration: 0.6 }
  }
};

const iconVariants = {
  animate: {
    rotate: [0, 360],
    scale: [1, 1.1, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const ahwIconVariants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1
    }
  }
};

const sparkleAnimation = {
  scale: [0, 1, 0],
  rotate: [0, 180, 360]
};

const sparkleTransition = {
  duration: 2,
  repeat: Infinity,
  delay: 1
};

const statusDotAnimation = {
  scale: [1, 1.5, 1],
  opacity: [1, 0.5, 1]
};

const statusDotTransition = {
  duration: 2,
  repeat: Infinity
};

const ahwGlowAnimation = {
  scale: [1, 1.3, 1],
  opacity: [0.3, 0.6, 0.3]
};

const ahwGlowTransition = {
  duration: 2.5,
  repeat: Infinity,
  ease: "easeInOut"
};

const buttonHover = { scale: 1.05 };
const buttonTap = { scale: 0.95 };

const Header: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = useMemo(() => location.pathname === '/', [location.pathname]);

  // Memoize callbacks
  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleBackClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Memoize floating particles data
  const mainParticles = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: `main-${i}`,
      left: `${20 + i * 30}%`,
      top: `${30 + i * 20}%`,
      delay: i * 0.8
    })), []
  );

  const ahwParticles = useMemo(() => 
    Array.from({ length: 2 }, (_, i) => ({
      id: `ahw-${i}`,
      left: `${60 + i * 20}%`,
      top: `${40 + i * 15}%`,
      delay: i * 1.2 + 2
    })), []
  );

  return (
    <motion.header 
      className="relative mb-8"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent blur-sm"></div>
      
      <div className="lol-card border-amber-500/30 relative overflow-hidden">
        {/* Animated Border Effects */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        
        <div className="flex items-center justify-between p-6">
          {/* Main Logo Section */}
          <motion.div 
            className="flex items-center space-x-6 cursor-pointer"
            variants={logoVariants}
            whileHover="hover"
            onClick={handleLogoClick}
          >
            <div className="relative">
              <motion.div
                className="flex items-center space-x-2"
                variants={iconVariants}
                animate="animate"
              >
                <Sword className="h-8 w-8 text-amber-400" />
                <Shield className="h-8 w-8 text-blue-400" />
              </motion.div>
              
              {/* Sparkle effects around logo */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={sparkleAnimation}
                transition={sparkleTransition}
              >
                <Sparkles className="h-4 w-4 text-yellow-300" />
              </motion.div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400">
                RIFT ANALYTICS
              </h1>
              <p className="text-sm text-slate-400 font-medium">
                League of Legends Match Intelligence
              </p>
            </div>

            {/* Partnership Divider */}
            <div className="flex items-center space-x-3">
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
              <span className="text-xs text-slate-500 font-medium">×</span>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
            </div>

            {/* Arab Hardware Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              variants={ahwIconVariants}
              animate="animate"
            >
              <div className="relative">
                <motion.div
                  className="flex items-center space-x-1"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Cpu className="h-7 w-7 text-orange-400" />
                  <Gamepad2 className="h-7 w-7 text-red-400" />
                </motion.div>
                
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-orange-400/20 rounded-full blur-md -z-10"
                  animate={ahwGlowAnimation}
                  transition={ahwGlowTransition}
                />
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-400">
                  ARAB HARDWARE
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Gaming & Tech Innovation
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Navigation/Status */}
          <div className="flex items-center space-x-4">
            {!isHomePage && (
              <motion.button
                className="lol-button px-4 py-2 text-sm"
                onClick={handleBackClick}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <Crown className="h-4 w-4 mr-2" />
                Battle Overview
              </motion.button>
            )}
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={statusDotAnimation}
                transition={statusDotTransition}
              />
              <span className="text-xs text-slate-400 font-medium">RIFT ONLINE</span>
            </div>
          </div>
        </div>

        {/* Floating particles inside header */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {mainParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-amber-400 rounded-full opacity-30"
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                y: [0, -10, 0],
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Additional orange particles for Arab Hardware */}
          {ahwParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-25"
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                y: [0, -8, 0],
                scale: [0.3, 0.8, 0.3],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.header>
  );
});

Header.displayName = 'Header';

export default Header;
