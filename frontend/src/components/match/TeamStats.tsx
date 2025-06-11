import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Team } from '@/types/match';
import { getTeamColor, formatNumber } from '@/utils/helpers';
import { Sword, Shield, Target, TrendingUp } from 'lucide-react';

interface TeamStatsProps {
  team: Team;
}

const TeamStats: React.FC<TeamStatsProps> = ({ team }) => {
  const teamColor = getTeamColor(team.teamId);
  
  const stats = [
    {
      icon: <Sword className="h-5 w-5" />,
      label: 'Total Kills',
      value: team.stats.totalKills,
      color: 'text-red-600'
    },
    {
      icon: <Shield className="h-5 w-5" />,
      label: 'Total Deaths', 
      value: team.stats.totalDeaths,
      color: 'text-gray-600'
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: 'Total Assists',
      value: team.stats.totalAssists,
      color: 'text-blue-600'
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'Team KDA',
      value: team.stats.teamKDA,
      color: 'text-purple-600'
    }
  ];

  return (
    <Card className={`${teamColor.bg} ${team.win ? 'winner-glow' : ''} h-full`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-xl ${teamColor.textClass}`}>
            {teamColor.name}
          </CardTitle>
          <Badge variant={team.win ? "win" : "lose"}>
            {team.win ? "VICTORY" : "DEFEAT"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-white/50 rounded-lg">
              <div className={`flex items-center justify-center mb-1 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Damage:</span>
            <span className="font-semibold">{formatNumber(team.stats.totalDamage)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Gold:</span>
            <span className="font-semibold text-gold-dark">{formatNumber(team.stats.totalGold)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg Damage:</span>
            <span className="font-semibold">{formatNumber(team.stats.averageDamage)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamStats;
