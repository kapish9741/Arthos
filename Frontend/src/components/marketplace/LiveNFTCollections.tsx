import { useNFTList, useTrendingNFTs } from "@/hooks/useNFT"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

export function LiveNFTCollections() {
  const { data: nftList, loading, error } = useNFTList({ per_page: 12 });
  const { data: trendingNFTs } = useTrendingNFTs();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-48 w-full rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Error loading NFTs: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live NFT Collections</h2>
        {trendingNFTs && trendingNFTs.length > 0 && (
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="w-4 h-4" />
            {trendingNFTs.length} Trending
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nftList.map((nft) => (
          <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-0">
              <div className="relative aspect-square">
                <img
                  src={nft.image?.small || nft.image?.thumb}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
                {nft.floor_price_24h_percentage_change && (
                  <Badge
                    variant={nft.floor_price_24h_percentage_change > 0 ? "secondary" : "destructive"}
                    className={`absolute top-2 right-2 ${nft.floor_price_24h_percentage_change > 0 ? 'bg-green-500 text-white' : ''}`}
                  >
                    {nft.floor_price_24h_percentage_change > 0 ? "+" : ""}
                    {nft.floor_price_24h_percentage_change.toFixed(2)}%
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 truncate">{nft.name}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Floor Price</span>
                  <span className="font-medium">
                    ${nft.floor_price_in_usd?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-medium">
                    ${(nft.market_cap_in_usd / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span className="font-medium">
                    ${(nft.volume_24h_in_usd / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
