import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import { throttle } from '@/utils/helpers';

interface LayoutProps {
  children: React.ReactNode;
}

// Static animation variants to prevent re-creation
const layoutVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const Layout: React.FC<LayoutProps> = React.memo(({ children }) => {
  const [scrollY, setScrollY] = useState(0);

  // Memoize floating particles data
  const particles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: `particle-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      colors: ['text-blue-400/20', 'text-purple-400/20', 'text-amber-400/20', 'text-red-400/20'],
      colorIndex: Math.floor(Math.random() * 4)
    })), []
  );

  const sparkles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: `sparkle-${i}`,
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2
    })), []
  );

  const ambientGlows = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: `glow-${i}`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: i * 2,
      duration: 10 + i * 2,
      colors: ['bg-blue-500/10', 'bg-purple-500/10', 'bg-amber-500/10'][i]
    })), []
  );

  // Throttled scroll handler for parallax effect
  const handleScroll = useCallback(
    throttle(() => {
      setScrollY(window.scrollY);
    }, 16), // ~60fps
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Memoize background transform for parallax
  const backgroundTransform = useMemo(() => 
    `translateY(${scrollY * 0.1}px)`,
    [scrollY]
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen relative overflow-hidden"
        variants={layoutVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {/* Multi-layer Background System */}
        <div 
          className="fixed inset-0 z-0"
          style={{ transform: backgroundTransform }}
        >
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          
          {/* Animated gradient layers */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Diagonal pattern overlay */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(45deg, 
                rgba(59, 130, 246, 0.05) 25%, 
                transparent 25%, 
                transparent 50%, 
                rgba(59, 130, 246, 0.05) 50%, 
                rgba(59, 130, 246, 0.05) 75%, 
                transparent 75%)`,
              backgroundSize: '60px 60px'
            }}
            animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating Particles */}
        <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={`absolute w-2 h-2 rounded-full ${particle.colors[particle.colorIndex]}`}
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, 30, -30, 0],
                scale: [0.5, 1, 0.5],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Sparkle Effects */}
        <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute w-1 h-1 bg-amber-300 rounded-full"
              style={{
                left: sparkle.left,
                top: sparkle.top,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: sparkle.duration,
                delay: sparkle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Ambient Glow Effects */}
        <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
          {ambientGlows.map((glow) => (
            <motion.div
              key={glow.id}
              className={`absolute w-96 h-96 ${glow.colors} rounded-full blur-3xl`}
              style={{
                left: glow.left,
                top: glow.top,
              }}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.1, 0.3, 0.1],
                x: [0, 100, -100, 0],
                y: [0, -50, 50, 0],
              }}
              transition={{
                duration: glow.duration,
                delay: glow.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Background overlay gradients */}
        <motion.div
          className="fixed inset-0 z-10 pointer-events-none"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(59, 130, 246, 0.02) 0%, transparent 100%)',
              'linear-gradient(135deg, rgba(168, 85, 247, 0.02) 0%, transparent 100%)',
              'linear-gradient(225deg, rgba(245, 158, 11, 0.02) 0%, transparent 100%)',
              'linear-gradient(315deg, rgba(239, 68, 68, 0.02) 0%, transparent 100%)',
              'linear-gradient(45deg, rgba(59, 130, 246, 0.02) 0%, transparent 100%)',
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main Content */}
        <div className="relative z-20">
          <Header />
          
          <motion.main 
            className="container mx-auto px-4 py-8 relative z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {children}
          </motion.main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

Layout.displayName = 'Layout';

export default Layout;