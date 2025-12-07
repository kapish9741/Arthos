const axios = require('axios');

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

class CoinGeckoService {
  constructor() {
    this.apiKey = process.env.COINGECKO_API_KEY;
    this.headers = this.apiKey ? { 'x-cg-demo-api-key': this.apiKey } : {};
  }

  // Crypto APIs
  async getCryptoList(params = {}) {
    try {
      const { 
        vs_currency = 'usd', 
        order = 'market_cap_desc', 
        per_page = 100, 
        page = 1,
        sparkline = false,
        price_change_percentage = '24h'
      } = params;

      const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
        headers: this.headers,
        params: {
          vs_currency,
          order,
          per_page,
          page,
          sparkline,
          price_change_percentage
        }
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error (getCryptoList):', error.response?.data || error.message);
      throw new Error('Failed to fetch crypto list from CoinGecko');
    }
  }

  async getCryptoDetails(coinId) {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/coins/${coinId}`, {
        headers: this.headers,
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: true,
          developer_data: false,
          sparkline: true
        }
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error (getCryptoDetails):', error.response?.data || error.message);
      throw new Error(`Failed to fetch details for ${coinId}`);
    }
  }

  async getTrendingCrypto() {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/search/trending`, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error (getTrendingCrypto):', error.response?.data || error.message);
      throw new Error('Failed to fetch trending crypto');
    }
  }

  async getCryptoMarketChart(coinId, params = {}) {
    try {
      const { 
        vs_currency = 'usd', 
        days = 7,
        interval = 'daily'
      } = params;

      const response = await axios.get(`${COINGECKO_API_URL}/coins/${coinId}/market_chart`, {
        headers: this.headers,
        params: {
          vs_currency,
          days,
          interval
        }
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error (getCryptoMarketChart):', error.response?.data || error.message);
      throw new Error(`Failed to fetch market chart for ${coinId}`);
    }
  }

  // NFT APIs
  async getNFTList(params = {}) {
    try {
      const { 
        order = 'market_cap_desc', 
        per_page = 100, 
        page = 1 
      } = params;

      const response = await axios.get(`${COINGECKO_API_URL}/nfts/list`, {
        headers: this.headers,
        params: {
          order,
          per_page,
          page
        }
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error (getNFTList):', error.response?.data || error.message);
      throw new Error('Failed to fetch NFT list from CoinGecko');
    }
  }

  async getNFTDetails(nftId) {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/nfts/${nftId}`, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error (getNFTDetails):', error.response?.data || error.message);
      throw new Error(`Failed to fetch NFT details for ${nftId}`);
    }
  }

  async getTrendingNFTs() {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/search/trending`, {
        headers: this.headers
      });

      // Extract NFTs from trending data
      return response.data.nfts || [];
    } catch (error) {
      console.error('CoinGecko API Error (getTrendingNFTs):', error.response?.data || error.message);
      throw new Error('Failed to fetch trending NFTs');
    }
  }

  async getNFTMarketChart(nftId, params = {}) {
    try {
      const { days = 7 } = params;

      const response = await axios.get(`${COINGECKO_API_URL}/nfts/${nftId}/market_chart`, {
        headers: this.headers,
        params: { days }
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error (getNFTMarketChart):', error.response?.data || error.message);
      throw new Error(`Failed to fetch NFT market chart for ${nftId}`);
    }
  }

  // Global Market Data
  async getGlobalMarketData() {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/global`, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error (getGlobalMarketData):', error.response?.data || error.message);
      throw new Error('Failed to fetch global market data');
    }
  }
}

module.exports = new CoinGeckoService();
