import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader"
import { HeroCarousel } from "@/components/marketplace/HeroCarousel"
import { FeaturedCollections } from "@/components/marketplace/FeaturedCollections"
import { TrendingSidebar } from "@/components/marketplace/TrendingSidebar"

export default function MarketplacePage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <MarketplaceHeader />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <HeroCarousel />
          <FeaturedCollections />
        </div>
        <TrendingSidebar />
      </div>
    </div>
  )
}
