import { marketApi } from './api';

// Crypto API calls
export const cryptoAPI = {
  getList: async (params: Record<string, any> = {}) => {
    const { data } = await marketApi.get('/market/crypto/list', { params });
    return data;
  },

  getDetails: async (coinId: string) => {
    const { data } = await marketApi.get(`/market/crypto/details/${coinId}`);
    return data;
  },

  getTrending: async () => {
    const { data } = await marketApi.get('/market/crypto/trending');
    return data;
  },

  getChart: async (coinId: string, params: Record<string, any> = {}) => {
    const { data } = await marketApi.get(`/market/crypto/chart/${coinId}`, { params });
    return data;
  },
};

// NFT API calls
export const nftAPI = {
  getList: async (params: Record<string, any> = {}) => {
    const { data } = await marketApi.get('/market/nft/list', { params });
    return data;
  },

  getDetails: async (nftId: string) => {
    const { data } = await marketApi.get(`/market/nft/details/${nftId}`);
    return data;
  },

  getTrending: async () => {
    const { data } = await marketApi.get('/market/nft/trending');
    return data;
  },

  getChart: async (nftId: string, params: Record<string, any> = {}) => {
    const { data } = await marketApi.get(`/market/nft/chart/${nftId}`, { params });
    return data;
  },
};

// Global Market Data
export const marketAPI = {
  getGlobal: async () => {
    const { data } = await marketApi.get('/market/global');
    return data;
  },
};
