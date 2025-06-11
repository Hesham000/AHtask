import React, { useMemo, useCallback } from 'react';
import { useMatch } from '@/hooks/useMatch';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import TeamComparison from '@/components/match/TeamComparison';
import { AlertCircle, RefreshCw, Trophy, Clock } from 'lucide-react';

// Static arrays to prevent re-creation
const loadingSkeletons = Array.from({ length: 4 }, (_, i) => i);
const teamSkeletons = Array.from({ length: 4 }, (_, i) => i);

const Home: React.FC = React.memo(() => {
  const { match, loading, error, refetch } = useMatch();

  // Memoize callbacks
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoize loading skeletons
  const winnerBannerSkeleton = useMemo(() => (
    <Card className="p-6">
      <div className="flex items-center justify-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </Card>
  ), []);

  const teamStatsSkeleton = useMemo(() => (
    <Card className="p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {teamSkeletons.map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  ), []);

  const playerCardsSkeleton = useMemo(() => (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-32 mx-auto" />
        {loadingSkeletons.map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-32 mx-auto" />
        {loadingSkeletons.map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  ), []);

  // Memoize error state
  const errorContent = useMemo(() => (
    <Card className="p-8 text-center max-w-md mx-auto">
      <CardContent>
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-400 mb-2">Match Data Unavailable</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <Button 
          onClick={handleRefresh} 
          className="lol-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Reconnecting...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  ), [error, handleRefresh, loading]);

  // Memoize loading content
  const loadingContent = useMemo(() => (
    <div className="space-y-8">
      {/* Winner Banner Skeleton */}
      {winnerBannerSkeleton}

      {/* Team Stats Skeletons */}
      <div className="grid md:grid-cols-2 gap-6">
        {teamStatsSkeleton}
        {teamStatsSkeleton}
      </div>

      {/* Player Cards Skeletons */}
      {playerCardsSkeleton}
    </div>
  ), [winnerBannerSkeleton, teamStatsSkeleton, playerCardsSkeleton]);

  if (loading) {
    return (
      <Layout>
        {loadingContent}
      </Layout>
    );
  }

  if (error || !match) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          {errorContent}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-red-400 mb-4">
            SUMMONER'S RIFT
          </h1>
          
          {/* Match Info */}
          <div className="flex items-center justify-center space-x-6 text-slate-400">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Duration: {match.formattedDuration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Ranked Solo/Duo</span>
            </div>
          </div>
        </div>

        {/* Team Comparison */}
        <TeamComparison matchData={match} />
      </div>
    </Layout>
  );
});

Home.displayName = 'Home';

export default Home;
