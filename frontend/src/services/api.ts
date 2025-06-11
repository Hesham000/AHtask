import axios from 'axios';
import { ApiResponse, MatchOverview, DetailedPlayer } from '@/types/match';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Error handling bta3 el response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
)

export const matchApi ={
    // Get match overview
    getMatchOverview: async (): Promise<ApiResponse<MatchOverview>> => {
        const response  = await api.get('/matches/overview')
        return response.data;
    },

    // Get teams comparison
    getTeamsComparison: async ()=> {
        const response = await api.get('/matches/teams/comparison')
        return response.data
    },

    //Get match metadata
    getMatchMetadata: async()=>{
        const response = await api.get('/matches/metadata')
        return response.data
    },
}

export const playerApi = {
    // Get player Stat for mvp page
    getPlayerDetails: async (puuid: string): Promise<ApiResponse<DetailedPlayer>> => {
        const response = await api.get(`/players/${puuid}`)
        return response.data
    },

    //Get all players summary
    getPlayersSummary: async () => {
        const response = await api.get('/players/summary');
        return response.data
    },

    //Compare two players
    comparePlayer: async (puuid1: string, puuid2: string) => {
        const response = await api.get(`/players/compare/${puuid1}/${puuid2}`)
        return response.data;
    }
};

export default api;
