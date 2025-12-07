import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type Action = "BUY" | "HOLD" | "SELL"

interface AiBuySellBadgeProps {
  action: Action
  confidence: number // 0.0-1.0
  reason?: string
  onExplain?: () => void
  className?: string
}

export function AiBuySellBadge({
  action,
  confidence,
  reason,
  onExplain,
  className
}: AiBuySellBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const getActionConfig = (action: Action) => {
    switch (action) {
      case "BUY":
        return {
          label: "AI: Buy",
          variant: "success" as const,
          icon: TrendingUp,
          color: "text-green-400"
        }
      case "SELL":
        return {
          label: "AI: Sell",
          variant: "destructive" as const,
          icon: TrendingDown,
          color: "text-red-400"
        }
      case "HOLD":
        return {
          label: "AI: Hold",
          variant: "warning" as const,
          icon: Minus,
          color: "text-yellow-400"
        }
    }
  }

  const config = getActionConfig(action)
  const Icon = config.icon
  const confidencePercent = Math.round(confidence * 100)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Badge
          variant={config.variant}
          className="gap-1 cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={`AI suggests ${action} with ${confidencePercent}% confidence`}
        >
          <Icon className="h-3 w-3" />
          {config.label}
          <span className="text-[10px] opacity-80">({confidencePercent}%)</span>
        </Badge>
        
        {showTooltip && reason && (
          <div className="absolute z-50 w-48 p-2 mt-1 text-xs bg-neutral-800 border border-neutral-700 rounded-md shadow-lg">
            {reason}
          </div>
        )}
      </div>

      {onExplain && (
        <button
          onClick={onExplain}
          className="text-blue-400 hover:text-blue-300 transition-colors"
          aria-label="Explain AI suggestion"
        >
          <Info className="h-3 w-3" />
        </button>
      )}
      
      <p className="text-[10px] text-neutral-500 mt-1">
        AI suggestion for informational purposes only. Do your own research.
      </p>
    </div>
  )
}
