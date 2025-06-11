import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Loader2 } from 'lucide-react';
import './index.css';

// Code splitting with React.lazy()
const Home = React.lazy(() => import('./pages/Home'));
const MVP = React.lazy(() => import('./pages/MVP'));

// Enhanced loading component with League of Legends theme
const LoadingFallback: React.FC = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    {/* Background Effects */}
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-amber-900/20 animate-pulse"></div>
      
      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>

    {/* Loading Content */}
    <motion.div 
      className="text-center z-10 relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Crown */}
      <motion.div
        className="mb-6 flex justify-center"
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="p-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-lg">
          <Crown className="h-12 w-12 text-slate-900" />
        </div>
      </motion.div>

      {/* Loading Spinner */}
      <motion.div
        className="mb-4 flex justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="h-8 w-8 text-amber-400" />
      </motion.div>

      {/* Loading Text */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-2">
          LOADING RIFT DATA
        </h2>
        <p className="text-slate-400 text-lg">
          Summoning champions...
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        className="mt-6 w-64 h-2 bg-slate-700 rounded-full overflow-hidden mx-auto"
        initial={{ width: 0 }}
        animate={{ width: 256 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
          animate={{ 
            x: [-256, 256, -256]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Error Boundary component for better error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <motion.div 
            className="text-center max-w-md mx-auto p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-red-500/20 rounded-full">
                <Crown className="h-12 w-12 text-red-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              RIFT CONNECTION LOST
            </h2>
            <p className="text-slate-400 mb-6">
              Something went wrong while loading the application.
            </p>
            
            <motion.button
              className="lol-button px-6 py-3"
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reconnect to Rift
            </motion.button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mvp/:puuid" element={<MVP />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
