import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AiRiskBadgeProps {
  riskScore: number // 0-100
  className?: string
}

export function AiRiskBadge({ riskScore, className }: AiRiskBadgeProps) {
  const getRiskLevel = (score: number) => {
    if (score < 30) return { label: "Low Risk", variant: "success" as const }
    if (score < 60) return { label: "Medium Risk", variant: "warning" as const }
    return { label: "High Risk", variant: "destructive" as const }
  }

  const { label, variant } = getRiskLevel(riskScore)

  return (
    <Badge variant={variant} className={cn("gap-1", className)} aria-label={`Risk score: ${riskScore} out of 100`}>
      <span className="text-[10px]">🛡️</span>
      {label} ({riskScore})
    </Badge>
  )
}
