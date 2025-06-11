import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DetailedPlayer } from '@/types/match';
import { getTeamColor, formatNumber, getPerformanceTier } from '@/utils/helpers';
import { PERFORMANCE_TIERS, POSITION_ICONS } from '@/utils/constants';
import { Crown, Trophy, Target, Zap, Eye } from 'lucide-react';

interface PlayerDetailsProps {
  player: DetailedPlayer;
}

const PlayerDetails: React.FC<PlayerDetailsProps> = ({ player }) => {
  const teamColor = getTeamColor(player.teamStats.teamId);
  const performanceTier = getPerformanceTier(player);
  const tierStyle = PERFORMANCE_TIERS[performanceTier as keyof typeof PERFORMANCE_TIERS];

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <Card className={`${teamColor.bg} border-2 ${teamColor.textClass}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
              <img 
                src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${player.championName}.png`}
                alt={player.championName}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  // Set to a simple gray placeholder without any external requests
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.style.backgroundColor = '#cccccc';
                  target.parentElement!.innerHTML = '<div style="width:64px;height:64px;display:flex;align-items:center;justify-content:center;color:#666;font-size:24px;">?</div>';
                }}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{player.playerName}</h1>
                <Badge variant="mvp">
                  <Crown className="h-4 w-4 mr-1" />
                  MVP CANDIDATE
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-lg">
                <span className="flex items-center space-x-1">
                  <span>{POSITION_ICONS[player.position as keyof typeof POSITION_ICONS]}</span>
                  <span className="font-semibold">{player.championName}</span>
                </span>
                <span className="text-gray-600">•</span>
                <span className="font-semibold">{player.position}</span>
                <span className="text-gray-600">•</span>
                <span className="font-semibold">Level {player.champLevel}</span>
              </div>
              
              <div className="flex items-center space-x-4 mt-2">
                <Badge 
                  variant="performance" 
                  className={`${tierStyle.color} ${tierStyle.bg} font-bold`}
                >
                  {performanceTier} Performance
                </Badge>
                <Badge variant={player.win ? "win" : "lose"}>
                  {player.win ? "VICTORY" : "DEFEAT"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center text-red-600 mb-2">
              <Target className="h-8 w-8" />
            </div>
            <CardTitle className="text-lg">KDA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600 mb-1">
              {player.kills}/{player.deaths}/{player.assists}
            </p>
            <p className="text-lg font-semibold text-gray-600">{player.kda} Ratio</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center text-purple-600 mb-2">
              <Zap className="h-8 w-8" />
            </div>
            <CardTitle className="text-lg">Kill Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold stat-highlight mb-1">
              {player.killParticipation}%
            </p>
            <p className="text-sm text-gray-600">
              Team: {player.teamStats.teamKills} kills
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center text-orange-600 mb-2">
              <Trophy className="h-8 w-8" />
            </div>
            <CardTitle className="text-lg">Damage Dealt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600 mb-1">
              {formatNumber(player.totalDamageDealtToChampions)}
            </p>
            <p className="text-sm text-gray-600">
              {player.detailedStats.teamDamagePercentage}% of team
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center text-blue-600 mb-2">
              <Eye className="h-8 w-8" />
            </div>
            <CardTitle className="text-lg">Vision Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {player.visionScore}
            </p>
            <p className="text-sm text-gray-600">
              {player.detailedStats.wardsPlaced} wards placed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerDetails;
