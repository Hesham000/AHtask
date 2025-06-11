import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailedPlayer } from '@/types/match';
import { formatNumber } from '@/utils/helpers';
import { 
  Sword, 
  Shield, 
  Coins, 
  TrendingUp, 
  Eye, 
  Target,
  Zap,
  Star
} from 'lucide-react';

interface PlayerStatsProps {
  player: DetailedPlayer;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const combatStats = [
    { label: 'Largest Killing Spree', value: player.detailedStats.largestKillingSpree, icon: <Sword className="h-5 w-5 text-red-600" /> },
    { label: 'Largest Multi Kill', value: player.detailedStats.largestMultiKill, icon: <Target className="h-5 w-5 text-orange-600" /> },
    { label: 'Double Kills', value: player.detailedStats.doubleKills, icon: <Zap className="h-5 w-5 text-yellow-600" /> },
    { label: 'Triple Kills', value: player.detailedStats.tripleKills, icon: <Star className="h-5 w-5 text-purple-600" /> },
  ];

  const economyStats = [
    { label: 'Gold Earned', value: formatNumber(player.goldEarned), icon: <Coins className="h-5 w-5 text-gold" /> },
    { label: 'Gold per Minute', value: player.detailedStats.goldPerMinute, icon: <TrendingUp className="h-5 w-5 text-gold-dark" /> },
    { label: 'CS (Minions)', value: player.totalMinionsKilled, icon: <Sword className="h-5 w-5 text-green-600" /> },
    { label: 'CS per Minute', value: player.detailedStats.csPerMinute, icon: <TrendingUp className="h-5 w-5 text-green-600" /> },
  ];

  const damageStats = [
    { label: 'Damage Dealt', value: formatNumber(player.totalDamageDealtToChampions), icon: <Sword className="h-5 w-5 text-red-600" /> },
    { label: 'Damage per Minute', value: formatNumber(player.detailedStats.damagePerMinute), icon: <TrendingUp className="h-5 w-5 text-red-600" /> },
    { label: 'Damage Taken', value: formatNumber(player.detailedStats.totalDamageTaken), icon: <Shield className="h-5 w-5 text-blue-600" /> },
    { label: 'Total Healing', value: formatNumber(player.detailedStats.totalHeal), icon: <Shield className="h-5 w-5 text-green-600" /> },
  ];

  const visionStats = [
    { label: 'Vision Score', value: player.visionScore, icon: <Eye className="h-5 w-5 text-blue-600" /> },
    { label: 'Wards Placed', value: player.detailedStats.wardsPlaced, icon: <Eye className="h-5 w-5 text-blue-500" /> },
    { label: 'Wards Killed', value: player.detailedStats.wardsKilled, icon: <Target className="h-5 w-5 text-red-500" /> },
    { label: 'Vision Wards Bought', value: player.detailedStats.visionWardsBought, icon: <Coins className="h-5 w-5 text-blue-400" /> },
  ];

  const objectiveStats = [
    { label: 'Turret Kills', value: player.detailedStats.turretKills, icon: <Target className="h-5 w-5 text-gray-600" /> },
    { label: 'Dragon Kills', value: player.detailedStats.dragonKills, icon: <Star className="h-5 w-5 text-red-600" /> },
    { label: 'Baron Kills', value: player.detailedStats.baronKills, icon: <Star className="h-5 w-5 text-purple-600" /> },
    { label: 'Inhibitor Kills', value: player.detailedStats.inhibitorKills, icon: <Target className="h-5 w-5 text-orange-600" /> },
  ];

  const StatCard: React.FC<{ title: string; stats: any[]; className?: string }> = ({ title, stats, className = "" }) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {stat.icon}
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="font-bold text-lg">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        <StatCard title="Combat Performance" stats={combatStats} />
        <StatCard title="Economy & Farming" stats={economyStats} />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <StatCard title="Damage Statistics" stats={damageStats} />
        <StatCard title="Vision Control" stats={visionStats} />
      </div>
      
      <StatCard title="Objective Participation" stats={objectiveStats} />
    </div>
  );
};

export default PlayerStats;
