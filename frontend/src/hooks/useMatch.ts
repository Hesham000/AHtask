import { useState, useEffect, useCallback, useRef } from 'react';
import { matchApi } from '@/services/api';
import { MatchOverview } from '@/types/match';
import { debounce } from '@/utils/helpers';

interface UseMatchReturn {
  match: MatchOverview | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Simple in-memory cache for match data
const matchCache = new Map<string, { data: MatchOverview; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Global loading state to prevent multiple simultaneous requests
let isGlobalLoading = false;
const pendingRequests = new Map<string, Promise<MatchOverview | null>>();

export const useMatch = (): UseMatchReturn => {
  const [match, setMatch] = useState<MatchOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // Check cache first
  const getCachedMatch = useCallback((cacheKey: string = 'default'): MatchOverview | null => {
    const cached = matchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    // Clean up expired cache
    if (cached) {
      matchCache.delete(cacheKey);
    }
    return null;
  }, []);

  // Store in cache
  const setCachedMatch = useCallback((data: MatchOverview, cacheKey: string = 'default') => {
    matchCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }, []);

  const fetchMatch = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'default';
    
    // Check cache first unless force refresh
    if (!forceRefresh) {
      const cachedData = getCachedMatch(cacheKey);
      if (cachedData) {
        if (mountedRef.current) {
          setMatch(cachedData);
          setLoading(false);
          setError(null);
        }
        return;
      }
    }

    // Prevent multiple simultaneous requests
    if (pendingRequests.has(cacheKey)) {
      try {
        const result = await pendingRequests.get(cacheKey);
        if (mountedRef.current && result) {
          setMatch(result);
          setError(null);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to fetch cached data');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
      return;
    }

    try {
      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }
      
      // Create and store the promise
      const requestPromise = (async () => {
        const response = await matchApi.getMatchOverview();
        
        if (response.success && response.data) {
          // Cache the successful response
          setCachedMatch(response.data, cacheKey);
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch match data');
        }
      })();
      
      pendingRequests.set(cacheKey, requestPromise);
      
      const result = await requestPromise;
      
      if (mountedRef.current && result) {
        setMatch(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Error fetching match:', err);
      
      if (mountedRef.current) {
        setError(errorMessage);
        
        // Fallback to cached data if available (even if expired)
        const fallbackData = matchCache.get(cacheKey);
        if (fallbackData) {
          setMatch(fallbackData.data);
          setError(`Using cached data: ${errorMessage}`);
        }
      }
    } finally {
      // Clean up pending request
      pendingRequests.delete(cacheKey);
      
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [getCachedMatch, setCachedMatch]);

  // Debounced refetch to prevent rapid successive calls
  const debouncedRefetch = useCallback(
    debounce(() => fetchMatch(true), 300),
    [fetchMatch]
  );

  const refetch = useCallback(() => {
    debouncedRefetch();
  }, [debouncedRefetch]);

  useEffect(() => {
    mountedRef.current = true;
    fetchMatch();

    // Cleanup function
    return () => {
      mountedRef.current = false;
    };
  }, [fetchMatch]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    match,
    loading,
    error,
    refetch,
  };
};

// Utility function to clear match cache (useful for testing or manual cache invalidation)
export const clearMatchCache = () => {
  matchCache.clear();
  pendingRequests.clear();
};
