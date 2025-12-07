import { LiveCryptoList } from "@/components/marketplace/LiveCryptoList";

const StockMarketplacePage = () => {
  return (
    <div className="flex-1 p-6 bg-neutral-900 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Cryptocurrency Market</h1>
        </div>
        
        {/* Live Crypto Data from CoinGecko API */}
        <LiveCryptoList />
      </div>
    </div>
  );
};

export default StockMarketplacePage;
