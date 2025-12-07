import { useEffect } from "react"
import { AiInsightCard } from "./AiInsightCard"
import { Button } from "@/components/ui/button"
import { useAiRequest } from "@/hooks/ai/useAiRequest"
import { TrendingUp, Sparkles } from "lucide-react"

interface ExpenseInsight {
  predictedTotal: number
  biggestGrowthCategory: string
  optimizationTip: string
  uncategorizedCount: number
}

interface AiExpenseInsightsProps {
  userId: string
  onAutoCategorize?: () => void
  className?: string
}

export function AiExpenseInsights({ 
  userId, 
  onAutoCategorize,
  className 
}: AiExpenseInsightsProps) {
  const { data, loading, error, execute } = useAiRequest<ExpenseInsight>(
    `/expenses-insight?userId=${userId}`,
    {
      cacheTTL: 3 * 60 * 1000, // 3 minutes
    }
  )

  useEffect(() => {
    execute(undefined, true)
  }, [userId])

  // Mock data for development
  const mockData: ExpenseInsight = {
    predictedTotal: 3240.50,
    biggestGrowthCategory: "Dining & Entertainment",
    optimizationTip: "You could save $280/month by reducing dining expenses by 15%.",
    uncategorizedCount: 7
  }

  const displayData = data || (loading ? null : mockData)

  const handleAutoCategorize = async () => {
    // Call backend to auto-categorize
    try {
      await fetch("/api/transactions/auto-categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      })
      onAutoCategorize?.()
      // Refresh insights
      execute(undefined, true)
    } catch (err) {
      console.error("Failed to auto-categorize:", err)
    }
  }

  if (error) {
    return null // Silently fail for non-critical feature
  }

  return (
    <AiInsightCard
      title="AI Expense Insights"
      description="Smart spending analysis"
      loading={loading}
      className={className}
      content={
        displayData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-neutral-900 rounded-md">
              <span className="text-xs text-neutral-400">Next Month Forecast:</span>
              <span className="text-sm font-semibold text-neutral-200">
                ${displayData.predictedTotal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-neutral-300">Top Growing Category</p>
                <p className="text-xs text-neutral-400">{displayData.biggestGrowthCategory}</p>
              </div>
            </div>

            <div className="p-2 bg-blue-900/20 border border-blue-800/30 rounded-md">
              <p className="text-xs text-blue-200">{displayData.optimizationTip}</p>
            </div>

            {displayData.uncategorizedCount > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-neutral-700">
                <span className="text-xs text-neutral-400">
                  {displayData.uncategorizedCount} uncategorized transactions
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAutoCategorize}
                  className="h-7 text-xs gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  Auto-categorize
                </Button>
              </div>
            )}
          </div>
        )
      }
    />
  )
}
