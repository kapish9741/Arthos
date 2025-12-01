import { Search, Bell, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const categories = [
  { label: "All", active: true },
  { label: "Gaming", active: false },
  { label: "Art", active: false },
  { label: "PFPs", active: false },
  { label: "More", active: false },
]

export function MarketplaceHeader() {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search marketplace..."
            className="w-64 pl-10 bg-secondary border-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.label}
              variant={cat.active ? "secondary" : "ghost"}
              size="sm"
              className={cat.active ? "bg-muted text-foreground" : "text-muted-foreground"}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="default" className="bg-primary text-primary-foreground">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
