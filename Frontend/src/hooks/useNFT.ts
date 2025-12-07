import { useState, useEffect } from 'react';
import { nftAPI } from '@/lib/coingecko';

interface NFTData {
  id: string;
  name: string;
  symbol: string;
  image: {
    small: string;
    thumb: string;
  };
  floor_price_in_usd: number;
  market_cap_in_usd: number;
  volume_24h_in_usd: number;
  floor_price_24h_percentage_change: number;
}

interface UseNFTListParams {
  order?: string;
  per_page?: number;
  page?: number;
}

export function useNFTList(params: UseNFTListParams = {}) {
  const [data, setData] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await nftAPI.getList(params);
        
        if (mounted && response.success) {
          setData(response.data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to fetch NFT data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function useNFTDetails(nftId: string | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nftId) return;

    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await nftAPI.getDetails(nftId);
        
        if (mounted && response.success) {
          setData(response.data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to fetch NFT details');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [nftId]);

  return { data, loading, error };
}

export function useTrendingNFTs() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await nftAPI.getTrending();
        
        if (mounted && response.success) {
          setData(response.data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to fetch trending NFTs');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
