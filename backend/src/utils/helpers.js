// Validate PUUID

const validatePuuid = (puuid) => {
    if(!puuid || typeof puuid !== 'string') return false;
    //Check if puuid long alphanumeric
    return puuid.length >= 50 && /^[a-zA-Z0-9_-]+$/.test(puuid);
};

// Sanitize player name for desplay
const sanitizePlayerName = (name) => {
    if(!name) return 'Unknown player';
    return name.replace(/[<>]/g, '').trim();
}

// Format large number with commas
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get champion image URL
const getChampionImageUrl = (championName) => {

    return `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${championName}.png`; //Riot Data Dragon API
}

//get item image url
const getItemImageUrl = (itemId) => {
    if(!itemId ||itemId === 0) return null;
    return `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/item/${itemId}.png`;
}

//realize rank color

const getPerformanceColor = (tier) => {
    const colors = {
      'S+': '#FFD700', // Gold
      'S': '#C0C0C0',  // Silver
      'A': '#CD7F32',  // Bronze
      'B': '#4CAF50',  // Green
      'C': '#FF9800',  // Orange
      'D': '#F44336'   // Red
    };
    return colors[tier] || '#9E9E9E';
  };

//Clac time ago from timestamp
const timeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins/60)
    const diffDays = Math.floor(diffHours/24)

    if(diffDays > 0) return `${diffDays} day${diffDays >1 ? 's' : ''} ago`;
    if(diffHours > 0) return `${diffHours} hour${diffHours >1 ? 's' : ''} ago`;
    if(diffMins > 0) return `${diffMins} minute${diffMins >1 ? 's' : ''} ago`;
    return 'just now';
}

// Deep clone object
const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

//Lw value Empty
const isEmpty = (value) => {
    return value == null || value === '' || 
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
}

module.exports = {
    validatePuuid,
    sanitizePlayerName,
    formatNumber,
    getChampionImageUrl,
    getItemImageUrl,
    getPerformanceColor,
    timeAgo,
    deepClone,
    isEmpty
}
