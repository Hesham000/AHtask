import { useState, useEffect, useCallback, useRef } from 'react';
import { playerApi } from '@/services/api';
import { DetailedPlayer } from '@/types/match';
import { debounce } from '@/utils/helpers';

interface UsePlayerReturn {
  player: DetailedPlayer | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Simple in-memory cache for player data
const playerCache = new Map<string, { data: DetailedPlayer; timestamp: number }>();
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes (shorter than match data)

// Global state to prevent multiple simultaneous requests for the same player
const pendingPlayerRequests = new Map<string, Promise<DetailedPlayer | null>>();

export const usePlayer = (puuid: string): UsePlayerReturn => {
  const [player, setPlayer] = useState<DetailedPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const currentPuuidRef = useRef(puuid);

  // Update current puuid ref when it changes
  useEffect(() => {
    currentPuuidRef.current = puuid;
  }, [puuid]);

  // Check cache first
  const getCachedPlayer = useCallback((playerPuuid: string): DetailedPlayer | null => {
    const cached = playerCache.get(playerPuuid);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    // Clean up expired cache
    if (cached) {
      playerCache.delete(playerPuuid);
    }
    return null;
  }, []);

  // Store in cache
  const setCachedPlayer = useCallback((data: DetailedPlayer, playerPuuid: string) => {
    playerCache.set(playerPuuid, {
      data,
      timestamp: Date.now()
    });
  }, []);

  const fetchPlayer = useCallback(async (playerPuuid: string, forceRefresh = false) => {
    if (!playerPuuid) {
      if (mountedRef.current) {
        setError('Player PUUID is required');
        setLoading(false);
      }
      return;
    }

    // Check if this request is still relevant
    if (currentPuuidRef.current !== playerPuuid) {
      return;
    }

    // Check cache first unless force refresh
    if (!forceRefresh) {
      const cachedData = getCachedPlayer(playerPuuid);
      if (cachedData && mountedRef.current && currentPuuidRef.current === playerPuuid) {
        setPlayer(cachedData);
        setLoading(false);
        setError(null);
        return;
      }
    }

    // Prevent multiple simultaneous requests for the same player
    if (pendingPlayerRequests.has(playerPuuid)) {
      try {
        const result = await pendingPlayerRequests.get(playerPuuid);
        if (mountedRef.current && currentPuuidRef.current === playerPuuid && result) {
          setPlayer(result);
          setError(null);
        }
      } catch (err) {
        if (mountedRef.current && currentPuuidRef.current === playerPuuid) {
          setError(err instanceof Error ? err.message : 'Failed to fetch cached player data');
        }
      } finally {
        if (mountedRef.current && currentPuuidRef.current === playerPuuid) {
          setLoading(false);
        }
      }
      return;
    }

    try {
      if (mountedRef.current && currentPuuidRef.current === playerPuuid) {
        setLoading(true);
        setError(null);
      }
      
      // Create and store the promise
      const requestPromise = (async () => {
        const response = await playerApi.getPlayerDetails(playerPuuid);
        
        if (response.success && response.data) {
          // Cache the successful response
          setCachedPlayer(response.data, playerPuuid);
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch player data');
        }
      })();
      
      pendingPlayerRequests.set(playerPuuid, requestPromise);
      
      const result = await requestPromise;
      
      if (mountedRef.current && currentPuuidRef.current === playerPuuid && result) {
        setPlayer(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Error fetching player:', err);
      
      if (mountedRef.current && currentPuuidRef.current === playerPuuid) {
        setError(errorMessage);
        
        // Fallback to cached data if available (even if expired)
        const fallbackData = playerCache.get(playerPuuid);
        if (fallbackData) {
          setPlayer(fallbackData.data);
          setError(`Using cached data: ${errorMessage}`);
        }
      }
    } finally {
      // Clean up pending request
      pendingPlayerRequests.delete(playerPuuid);
      
      if (mountedRef.current && currentPuuidRef.current === playerPuuid) {
        setLoading(false);
      }
    }
  }, [getCachedPlayer, setCachedPlayer]);

  // Debounced refetch to prevent rapid successive calls
  const debouncedRefetch = useCallback(
    debounce(() => {
      if (currentPuuidRef.current) {
        fetchPlayer(currentPuuidRef.current, true);
      }
    }, 300),
    [fetchPlayer]
  );

  const refetch = useCallback(() => {
    debouncedRefetch();
  }, [debouncedRefetch]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (puuid) {
      // Reset state when puuid changes
      setPlayer(null);
      setLoading(true);
      setError(null);
      
      fetchPlayer(puuid);
    } else {
      setError('Player PUUID is required');
      setLoading(false);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [puuid, fetchPlayer]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    player,
    loading,
    error,
    refetch,
  };
};

// Utility function to clear player cache (useful for testing or manual cache invalidation)
export const clearPlayerCache = (puuid?: string) => {
  if (puuid) {
    playerCache.delete(puuid);
    pendingPlayerRequests.delete(puuid);
  } else {
    playerCache.clear();
    pendingPlayerRequests.clear();
  }
};

// Preload player data (useful for prefetching)
export const preloadPlayer = async (puuid: string): Promise<void> => {
  try {
    if (!playerCache.has(puuid) && !pendingPlayerRequests.has(puuid)) {
      const response = await playerApi.getPlayerDetails(puuid);
      if (response.success && response.data) {
        playerCache.set(puuid, {
          data: response.data,
          timestamp: Date.now()
        });
      }
    }
  } catch (err) {
    console.warn('Failed to preload player data:', err);
  }
};
