"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const collections = [
  {
    id: 1,
    name: "NBA Top Shot",
    creator: "Dapper",
    verified: true,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    floorPrice: "0.8235",
    currency: "FLOW",
    items: "77,341",
    totalVolume: "512.7K",
    listed: "3.3%",
  },
  {
    id: 2,
    name: "Azuki",
    creator: "Azuki",
    verified: true,
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80",
    floorPrice: "12.5",
    currency: "ETH",
    items: "10,000",
    totalVolume: "850K",
    listed: "5.2%",
  },
  {
    id: 3,
    name: "Bored Ape Yacht Club",
    creator: "Yuga Labs",
    verified: true,
    image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&q=80",
    floorPrice: "28.9",
    currency: "ETH",
    items: "10,000",
    totalVolume: "1.2M",
    listed: "2.1%",
  },
]

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((i) => (i + 1) % collections.length)
  const prev = () => setCurrentIndex((i) => (i - 1 + collections.length) % collections.length)

  const collection = collections[currentIndex]

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8">
      <div className="h-[400px] bg-cover bg-center relative" style={{ backgroundImage: `url(${collection.image})` }}>
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/40 to-transparent" />

        <Button
          variant="ghost"
          size="icon"
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/70 text-foreground"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/70 text-foreground"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-bold text-foreground">{collection.name}</h2>
            {collection.verified && <BadgeCheck className="w-6 h-6 text-primary fill-primary" />}
          </div>
          <p className="text-muted-foreground mb-4">
            By {collection.creator}{" "}
            {collection.verified && <BadgeCheck className="inline w-4 h-4 text-primary fill-primary" />}
          </p>

          <div className="flex gap-8 bg-card/80 backdrop-blur-sm rounded-xl p-4 w-fit">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Floor Price</p>
              <p className="text-foreground font-semibold">
                {collection.floorPrice} <span className="text-muted-foreground">{collection.currency}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Items</p>
              <p className="text-foreground font-semibold">{collection.items}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Total Volume</p>
              <p className="text-foreground font-semibold">
                {collection.totalVolume} <span className="text-muted-foreground">{collection.currency}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Listed</p>
              <p className="text-foreground font-semibold">{collection.listed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {collections.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-8 h-1 rounded-full transition-colors ${i === currentIndex ? "bg-foreground" : "bg-muted"}`}
          />
        ))}
      </div>
    </div>
  )
}
