import { Home, TrendingUp, Wallet, Settings, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: TrendingUp, label: "Marketplace", path: "/marketplace" },
  { icon: Wallet, label: "My Wallet", path: "/wallet" },
  { icon: Settings, label: "Settings", path: "/settings" },
]

export function MarketplaceSidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Arthos</h1>
        <p className="text-sm text-muted-foreground">NFT & Stocks</p>
      </div>
      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
