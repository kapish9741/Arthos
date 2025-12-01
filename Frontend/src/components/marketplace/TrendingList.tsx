import { BadgeCheck } from "lucide-react"

interface TrendingItem {
  id: number
  name: string
  verified: boolean
  image: string
  price: string
  currency: string
  change: number
}

interface TrendingListProps {
  items: TrendingItem[]
  label: string
  priceLabel: string
}

export function TrendingList({ items, label, priceLabel }: TrendingListProps) {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground uppercase">
        <span>{label}</span>
        <span>{priceLabel}</span>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
          >
            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground text-sm truncate">{item.name}</span>
                {item.verified && <BadgeCheck className="w-4 h-4 text-primary fill-primary shrink-0" />}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-foreground font-medium">
                {item.price} <span className="text-muted-foreground text-xs">{item.currency}</span>
              </div>
              <div
                className={`text-xs font-medium ${
                  item.change > 0 ? "text-success" : item.change < 0 ? "text-danger" : "text-muted-foreground"
                }`}
              >
                {item.change > 0 ? "+" : ""}
                {item.change}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
