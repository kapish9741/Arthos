# CoinGecko API Integration

## Backend Setup

### Environment Variables
Add your CoinGecko API key to `.env`:
```
COINGECKO_API_KEY=your_api_key_here
```

### Available Endpoints

#### Crypto Endpoints

**GET /api/market/crypto/list**
- Get list of cryptocurrencies
- Query params: `vs_currency`, `order`, `per_page`, `page`, `sparkline`, `price_change_percentage`
- Example: `/api/market/crypto/list?per_page=50&order=market_cap_desc`

**GET /api/market/crypto/details/:coinId**
- Get detailed info for a specific cryptocurrency
- Example: `/api/market/crypto/details/bitcoin`

**GET /api/market/crypto/trending**
- Get trending cryptocurrencies
- Example: `/api/market/crypto/trending`

**GET /api/market/crypto/chart/:coinId**
- Get price chart data for a cryptocurrency
- Query params: `vs_currency`, `days`, `interval`
- Example: `/api/market/crypto/chart/bitcoin?days=7`

#### NFT Endpoints

**GET /api/market/nft/list**
- Get list of NFT collections
- Query params: `order`, `per_page`, `page`
- Example: `/api/market/nft/list?per_page=20`

**GET /api/market/nft/details/:nftId**
- Get detailed info for a specific NFT collection
- Example: `/api/market/nft/details/cryptopunks`

**GET /api/market/nft/trending**
- Get trending NFT collections
- Example: `/api/market/nft/trending`

**GET /api/market/nft/chart/:nftId**
- Get price chart data for an NFT collection
- Query params: `days`
- Example: `/api/market/nft/chart/cryptopunks?days=30`

#### Global Market Data

**GET /api/market/global**
- Get global cryptocurrency market data
- Example: `/api/market/global`

## Frontend Usage

### Custom Hooks

#### Crypto Hooks

```typescript
import { useCryptoList, useCryptoDetails, useTrendingCrypto } from '@/hooks/useCrypto';

// Get crypto list
const { data, loading, error } = useCryptoList({
  vs_currency: 'usd',
  per_page: 50,
  order: 'market_cap_desc'
});

// Get crypto details
const { data, loading, error } = useCryptoDetails('bitcoin');

// Get trending crypto
const { data, loading, error } = useTrendingCrypto();
```

#### NFT Hooks

```typescript
import { useNFTList, useNFTDetails, useTrendingNFTs } from '@/hooks/useNFT';

// Get NFT list
const { data, loading, error } = useNFTList({
  per_page: 20,
  order: 'market_cap_desc'
});

// Get NFT details
const { data, loading, error } = useNFTDetails('cryptopunks');

// Get trending NFTs
const { data, loading, error } = useTrendingNFTs();
```

### Direct API Calls

```typescript
import { cryptoAPI, nftAPI, marketAPI } from '@/lib/coingecko';

// Crypto
const cryptoList = await cryptoAPI.getList({ per_page: 100 });
const cryptoDetails = await cryptoAPI.getDetails('bitcoin');
const trending = await cryptoAPI.getTrending();
const chart = await cryptoAPI.getChart('bitcoin', { days: 7 });

// NFT
const nftList = await nftAPI.getList({ per_page: 50 });
const nftDetails = await nftAPI.getDetails('cryptopunks');
const trendingNFTs = await nftAPI.getTrending();
const nftChart = await nftAPI.getChart('cryptopunks', { days: 30 });

// Global
const globalData = await marketAPI.getGlobal();
```

## Example Component

```typescript
import { useCryptoList } from '@/hooks/useCrypto';

function CryptoList() {
  const { data, loading, error } = useCryptoList({
    per_page: 20,
    vs_currency: 'usd'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(coin => (
        <div key={coin.id}>
          <img src={coin.image} alt={coin.name} />
          <h3>{coin.name}</h3>
          <p>${coin.current_price}</p>
          <p>{coin.price_change_percentage_24h}%</p>
        </div>
      ))}
    </div>
  );
}
```

## Testing

Start the backend server:
```bash
cd Backend
npm start
```

Test endpoints:
- http://localhost:8080/api/market/crypto/list?per_page=10
- http://localhost:8080/api/market/nft/trending
- http://localhost:8080/api/market/global
