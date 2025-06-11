const { GAME_CONSTANTS } = require('./constants');

// Calculate kill participation percentage

const calculateKillParticipation = (playerKills, playerAssists, totalTeamKills) => {
    if (totalTeamKills === 0) return 0;
    return (((playerKills + playerAssists) / totalTeamKills) * 100).toFixed(1);
}

// Calculate KDA ratio

const calculateKDA = (kills, deaths, assists) => {
    if (deaths === 0) return 'Perfect';
    return ((kills + assists)/deaths).toFixed(2);
}

// Format game duration from seconds to MM:SS
const formatGameDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Calculate damage per minute

const calculateDamagePerMinute = (totalDamage, gameDurationSeconds)=>{
    const minutes = gameDurationSeconds / 60;
    return Math.round(totalDamage / minutes)
}

// Calculate CS per minute
const calculateCSPerMinute = (totalMinions, neutralMinions, gameDurationSeconds)=>{
    const minutes = gameDurationSeconds / 60;
    return ((totalMinions + neutralMinions) / minutes).toFixed(1);
}

// Calculate gold per minute
const calculateGoldPerMinute = (goldEarned, gameDurationSeconds) => {
    const minutes = gameDurationSeconds / 60;
    return Math.round(goldEarned / minutes);
}

//Performace tier based on stats

const getPerformanceTier = (player, teamPlayers) => {
    const killParticipation = parseFloat(calculateKillParticipation(
        player.kills,
        player.assists,
        teamPlayers.reduce((sum, p) => sum + p.kills, 0)
    ))

    const kda = player.deaths > 0 ? (player.kills + player.assists) / player.deaths : 999; //Dh top KDA aw a7sn KDA

    // Rate bta3 el player f el game
    
    if(killParticipation >= 80 && kda >= 3) return 'S+';
    if(killParticipation >= 70 && kda >= 2.5) return 'S';
    if(killParticipation >= 60 && kda >= 2) return 'A';
    if(killParticipation >= 50 && kda >= 1.5) return 'B';
    if(killParticipation >= 40 && kda >= 1) return 'C';
    return 'D';
}

// Get winnig team from teams data

const getWinningTeam = (teams) => {
    return teams.find(team => team.win === true);
}

// Calculate tottal team kills
const getTeamTotalKills = (players) => {
    return players.reduce((total, player) => total + player.kills, 0);
}

//Calculate damage perc

const calculateDamageShare = (playerDamage, teamTotalDamage) => {
    if(teamTotalDamage === 0) return 0;
    return ((playerDamage/teamTotalDamage)*100).toFixed(1);
}

//calculate MVP Score

const calculateMVPScore = (player, teamPlayers, gameDuration)=>{
    const killParticipation = parseFloat(calculateKillParticipation(
        player.kills,
        player.assists,
        teamPlayers.reduce((sum, p) => sum + p.kills, 0)
    ))

    const kda = player.deaths > 0 ? (player.kills + player.assists) / player.deaths : 10; //A7sn KDA aw a7sn 0 deaths
    const dpm = calculateDamagePerMinute(player.totalDamageDealtToChampions, gameDuration); //Dh damage per minute
    const gpm = calculateGoldPerMinute(player.goldEarned, gameDuration); //Dh gold per minute
    
    //Weighted score calculation
    const score =(
        (killParticipation * 0.3) +
        (kda * 10 * 0.25)+
        (dpm/100 * 0.25) +
        (player.visionScore * 0.1)+
        (gpm/100 * 0.1)
    );
    return Math.round(score*100)/100; 
}

module.exports = {
    calculateKillParticipation,
    calculateKDA,
    formatGameDuration,
    calculateDamagePerMinute,
    calculateCSPerMinute,
    calculateGoldPerMinute,
    getPerformanceTier,
    getWinningTeam,
    getTeamTotalKills,
    calculateDamageShare,
    calculateMVPScore,
}
