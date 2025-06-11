export const TEAM_COLORS = {
    100: {
      name: 'Blue Team',
      primary: '#1e40af',
      secondary: '#3b82f6',
      bg: 'bg-blue-50 border-l-4 border-blue-500',
      textClass: 'text-blue-600',
      bgClass: 'bg-blue-500',
    },
    200: {
      name: 'Red Team', 
      primary: '#dc2626',
      secondary: '#ef4444',
      bg: 'bg-red-50 border-l-4 border-red-500',
      textClass: 'text-red-600',
      bgClass: 'bg-red-500',
    },
  } as const;
  
  export const PERFORMANCE_TIERS = {
    'S+': { color: 'text-yellow-500', bg: 'bg-yellow-100' },
    'S': { color: 'text-orange-500', bg: 'bg-orange-100' },
    'A': { color: 'text-green-500', bg: 'bg-green-100' },
    'B': { color: 'text-blue-500', bg: 'bg-blue-100' },
    'C': { color: 'text-gray-500', bg: 'bg-gray-100' },
    'D': { color: 'text-red-500', bg: 'bg-red-100' },
  } as const;
  
  export const POSITION_ICONS = {
    TOP: '⚔️',
    JUNGLE: '🌿', 
    MIDDLE: '🔮',
    BOTTOM: '🏹',
    UTILITY: '🛡️',
    UNKNOWN: '❓',
  } as const;