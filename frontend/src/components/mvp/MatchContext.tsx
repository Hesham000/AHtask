import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DetailedPlayer } from '@/types/match';
import { getTeamColor } from '@/utils/helpers';
import { Clock,  Trophy, Gamepad2 } from 'lucide-react';

interface MatchContextProps {
  player: DetailedPlayer;
}

const MatchContext: React.FC<MatchContextProps> = ({ player }) => {
  const teamColor = getTeamColor(player.teamStats.teamId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gamepad2 className="h-5 w-5" />
          <span>Match Information</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Match Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 mb-3">Game Details</h4>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Match Duration</p>
                <p className="font-semibold">{player.matchContext.formattedDuration}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Gamepad2 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Game Version</p>
                <p className="font-semibold">{player.matchContext.gameVersion}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Trophy className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm text-gray-600">Queue Type</p>
                <p className="font-semibold">
                  {player.matchContext.queueId === 420 ? 'Ranked Solo/Duo' : `Queue ${player.matchContext.queueId}`}
                </p>
              </div>
            </div>
          </div>

          {/* Team Performance */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 mb-3">Team Performance</h4>
            
            <div className={`p-4 rounded-lg ${teamColor.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <h5 className={`font-semibold ${teamColor.textClass}`}>{teamColor.name}</h5>
                <Badge variant={player.teamStats.teamWin ? "win" : "lose"}>
                  {player.teamStats.teamWin ? "VICTORY" : "DEFEAT"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-600">Kills</p>
                  <p className="font-bold text-red-600">{player.teamStats.teamKills}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Deaths</p>
                  <p className="font-bold text-gray-600">{player.teamStats.teamDeaths}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Assists</p>
                  <p className="font-bold text-blue-600">{player.teamStats.teamAssists}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h6 className="font-semibold mb-2">Player's Contribution</h6>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Damage Share:</span>
                  <span className="font-semibold">{player.detailedStats.teamDamagePercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Kill Participation:</span>
                  <span className="font-semibold">{player.killParticipation}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Match ID: <span className="font-mono">{player.matchContext.matchId}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchContext;
