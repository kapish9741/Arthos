import { useEffect, useState } from "react"
import { AiInsightCard } from "./AiInsightCard"
import { AiRiskBadge } from "./AiRiskBadge"
import { Button } from "@/components/ui/button"
import { useAiRequest } from "@/hooks/ai/useAiRequest"

interface DailyBriefResponse {
  summary: string
  riskScore: number
  highlights: Array<{ assetId: string; delta: number }>
  suggestions: string[]
}

interface AiDailyBriefCardProps {
  userId: string
  className?: string
}

export function AiDailyBriefCard({ userId, className }: AiDailyBriefCardProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const { data, loading, error, execute } = useAiRequest<DailyBriefResponse>(
    `/daily-brief?userId=${userId}`,
    {
      cacheTTL: 5 * 60 * 1000, // 5 minutes cache
    }
  )

  useEffect(() => {
    // Fetch on mount
    execute(undefined, true)
  }, [userId])

  // Mock data for development (remove when backend is ready)
  const mockData: DailyBriefResponse = {
    summary: "Portfolio up 2.3% today. Top asset: ETH/NFT-Alpha. Market sentiment is positive.",
    riskScore: 62,
    highlights: [],
    suggestions: [
      "Reduce exposure to volatile NFT collections",
      "Consider adding stable coins to balance portfolio",
      "Review high-risk stocks in tech sector"
    ]
  }

  const displayData = data || (loading ? null : mockData)

  if (error) {
    return (
      <AiInsightCard
        title="AI Daily Brief"
        description="Unable to load insights"
        content={
          <p className="text-sm text-neutral-400">
            AI service temporarily unavailable. Please try again later.
          </p>
        }
        className={className}
      />
    )
  }

  return (
    <AiInsightCard
      title="AI Daily Brief"
      description="Your portfolio snapshot"
      loading={loading}
      className={className}
      content={
        displayData && (
          <div className="space-y-3">
            <p className="text-sm text-neutral-200">{displayData.summary}</p>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Risk Level:</span>
              <AiRiskBadge riskScore={displayData.riskScore} />
            </div>

            {showSuggestions && displayData.suggestions && (
              <div className="mt-3 p-3 bg-neutral-900 rounded-md border border-neutral-700">
                <h4 className="text-xs font-semibold text-neutral-300 mb-2">AI Suggestions:</h4>
                <ul className="space-y-1">
                  {displayData.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-xs text-neutral-400 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">→</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      }
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="w-full"
        >
          {showSuggestions ? "Hide Suggestions" : "View Suggestions"}
        </Button>
      }
    />
  )
}
