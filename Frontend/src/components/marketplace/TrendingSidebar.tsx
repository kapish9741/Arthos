"use client"

import { useState } from "react"
import { TrendingList } from "./TrendingList"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

const nftCollections = [
  {
    id: 1,
    name: "DX Terminal",
    verified: true,
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=80&q=80",
    price: "< 0.01",
    currency: "ETH",
    change: -7.9,
  },
  {
    id: 2,
    name: "Pudgy Penguins",
    verified: true,
    image: "https://images.unsplash.com/photo-1551410224-699683e15636?w=80&q=80",
    price: "10.49",
    currency: "ETH",
    change: 1,
  },
  {
    id: 3,
    name: "UNIOVERSE HEROES",
    verified: true,
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=80&q=80",
    price: "< 0.01",
    currency: "ETH",
    change: -14.4,
  },
  {
    id: 4,
    name: "CryptoPunks",
    verified: true,
    image: "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=80&q=80",
    price: "47.89",
    currency: "ETH",
    change: -0.9,
  },
  {
    id: 5,
    name: "Moonbirds",
    verified: true,
    image: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=80&q=80",
    price: "2.97",
    currency: "ETH",
    change: 11.7,
  },
  {
    id: 6,
    name: "Bored Ape Yacht Club",
    verified: true,
    image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=80&q=80",
    price: "9.38",
    currency: "ETH",
    change: 2,
  },
  {
    id: 7,
    name: "FARWORLD // Creatures",
    verified: true,
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=80&q=80",
    price: "< 0.01",
    currency: "ETH",
    change: -15.6,
  },
  {
    id: 8,
    name: "Wrapped Cryptopunks",
    verified: true,
    image: "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=80&q=80",
    price: "54.56",
    currency: "ETH",
    change: 0,
  },
  {
    id: 9,
    name: "Lil Pudgys",
    verified: true,
    image: "https://images.unsplash.com/photo-1551410224-699683e15636?w=80&q=80",
    price: "1.23",
    currency: "ETH",
    change: 0.6,
  },
  {
    id: 10,
    name: "Mullet Cop: Mint Condition",
    verified: true,
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=80&q=80",
    price: "62.00",
    currency: "SOMI",
    change: 0,
  },
  {
    id: 11,
    name: "Mutant Ape Yacht Club",
    verified: true,
    image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=80&q=80",
    price: "1.33",
    currency: "ETH",
    change: 0.8,
  },
  {
    id: 12,
    name: "Meebits",
    verified: true,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&q=80",
    price: "0.84",
    currency: "ETH",
    change: 12.4,
  },
]

const stocksData = [
  {
    id: 1,
    name: "Apple Inc.",
    verified: true,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=80&q=80",
    price: "189.43",
    currency: "USD",
    change: 2.1,
  },
  {
    id: 2,
    name: "Tesla Inc.",
    verified: true,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=80&q=80",
    price: "248.50",
    currency: "USD",
    change: -1.3,
  },
  {
    id: 3,
    name: "NVIDIA Corp.",
    verified: true,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=80&q=80",
    price: "495.22",
    currency: "USD",
    change: 5.7,
  },
  {
    id: 4,
    name: "Microsoft Corp.",
    verified: true,
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=80&q=80",
    price: "378.91",
    currency: "USD",
    change: 1.2,
  },
  {
    id: 5,
    name: "Amazon.com Inc.",
    verified: true,
    image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=80&q=80",
    price: "153.42",
    currency: "USD",
    change: -0.5,
  },
  {
    id: 6,
    name: "Meta Platforms",
    verified: true,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=80&q=80",
    price: "326.49",
    currency: "USD",
    change: 3.8,
  },
  {
    id: 7,
    name: "Alphabet Inc.",
    verified: true,
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=80&q=80",
    price: "141.80",
    currency: "USD",
    change: 0.9,
  },
  {
    id: 8,
    name: "AMD",
    verified: true,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=80&q=80",
    price: "127.65",
    currency: "USD",
    change: 4.2,
  },
  {
    id: 9,
    name: "Netflix Inc.",
    verified: true,
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=80&q=80",
    price: "485.12",
    currency: "USD",
    change: -2.1,
  },
  {
    id: 10,
    name: "Salesforce Inc.",
    verified: true,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&q=80",
    price: "263.78",
    currency: "USD",
    change: 1.5,
  },
  {
    id: 11,
    name: "Intel Corp.",
    verified: true,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=80&q=80",
    price: "44.32",
    currency: "USD",
    change: -3.2,
  },
  {
    id: 12,
    name: "Coinbase Global",
    verified: true,
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=80&q=80",
    price: "156.89",
    currency: "USD",
    change: 8.4,
  },
]

export function TrendingSidebar() {
  const [activeTab, setActiveTab] = useState<"nft" | "stocks">("nft")

  return (
    <aside className="w-80 border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Trending</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "nft" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("nft")}
            className={activeTab === "nft" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
          >
            NFTs
          </Button>
          <Button
            variant={activeTab === "stocks" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("stocks")}
            className={activeTab === "stocks" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
          >
            Stocks
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {activeTab === "nft" ? (
          <TrendingList items={nftCollections} label="COLLECTION" priceLabel="FLOOR" />
        ) : (
          <TrendingList items={stocksData} label="STOCK" priceLabel="PRICE" />
        )}
      </div>
    </aside>
  )
}
