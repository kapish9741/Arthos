import { useState, useEffect } from 'react';
import { cryptoAPI } from '@/lib/coingecko';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  atl: number;
}

interface UseCryptoListParams {
  vs_currency?: string;
  order?: string;
  per_page?: number;
  page?: number;
  sparkline?: boolean;
  price_change_percentage?: string;
}

export function useCryptoList(params: UseCryptoListParams = {}) {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await cryptoAPI.getList(params);
        
        if (mounted && response.success) {
          setData(response.data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to fetch crypto data');
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

export function useCryptoDetails(coinId: string | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coinId) return;

    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await cryptoAPI.getDetails(coinId);
        
        if (mounted && response.success) {
          setData(response.data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to fetch crypto details');
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
  }, [coinId]);

  return { data, loading, error };
}

export function useTrendingCrypto() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await cryptoAPI.getTrending();
        
        if (mounted && response.success) {
          setData(response.data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to fetch trending crypto');
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
