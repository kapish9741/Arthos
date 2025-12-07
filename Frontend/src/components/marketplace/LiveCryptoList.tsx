import { useCryptoList } from "@/hooks/useCrypto"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

export function LiveCryptoList() {
  const { data: cryptoList, loading, error } = useCryptoList({ 
    per_page: 20,
    vs_currency: 'usd',
    order: 'market_cap_desc',
    price_change_percentage: '24h'
  });

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Error loading crypto: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Live Cryptocurrency Prices</h2>

      <div className="space-y-2">
        {cryptoList.map((crypto, index) => (
          <Card key={crypto.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-muted-foreground font-medium w-6">
                    {crypto.market_cap_rank || index + 1}
                  </span>
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{crypto.name}</h3>
                    <p className="text-sm text-muted-foreground uppercase">
                      {crypto.symbol}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ${crypto.current_price.toLocaleString()}
                  </p>
                  <Badge
                    variant={crypto.price_change_percentage_24h > 0 ? "secondary" : "destructive"}
                    className={`gap-1 ${crypto.price_change_percentage_24h > 0 ? 'bg-green-500 text-white' : ''}`}
                  >
                    {crypto.price_change_percentage_24h > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {crypto.price_change_percentage_24h > 0 ? "+" : ""}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </Badge>
                </div>

                <div className="text-right min-w-[120px]">
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="font-medium">
                    ${(crypto.market_cap / 1000000000).toFixed(2)}B
                  </p>
                </div>

                <div className="text-right min-w-[120px]">
                  <p className="text-sm text-muted-foreground">Volume 24h</p>
                  <p className="font-medium">
                    ${(crypto.total_volume / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
