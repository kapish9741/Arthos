import { BadgeCheck } from "lucide-react"

const featuredCollections = [
  {
    id: 1,
    name: "SHRIMPERS",
    verified: true,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
    floorPrice: "0.076",
    currency: "ETH",
    change: -6.8,
  },
  {
    id: 2,
    name: "Aeons",
    verified: true,
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80",
    floorPrice: "0.0098",
    currency: "ETH",
    change: -28,
  },
  {
    id: 3,
    name: "CyberKongz",
    verified: true,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&q=80",
    floorPrice: "3.00",
    currency: "ETH",
    change: -10.5,
  },
  {
    id: 4,
    name: "Variance",
    verified: false,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    floorPrice: "22.00",
    currency: "SOMI",
    change: 5.2,
  },
]

export function FeaturedCollections() {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground">Featured Collections</h3>
        <p className="text-sm text-muted-foreground">This week&apos;s curated collections</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredCollections.map((collection) => (
          <div
            key={collection.id}
            className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <div
              className="h-40 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url(${collection.image})` }}
            />
            <div className="p-3">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-semibold text-foreground text-sm">{collection.name}</span>
                {collection.verified && <BadgeCheck className="w-4 h-4 text-primary fill-primary" />}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Floor price:</span>
                <span className="text-foreground font-medium">{collection.floorPrice}</span>
                <span className="text-muted-foreground">{collection.currency}</span>
                <span className={`ml-auto font-medium ${collection.change >= 0 ? "text-success" : "text-danger"}`}>
                  {collection.change >= 0 ? "+" : ""}
                  {collection.change}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
