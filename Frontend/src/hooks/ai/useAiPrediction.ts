import { useCallback } from "react"
import { useAiRequest } from "./useAiRequest"

export type AssetType = "stock" | "nft"
export type PredictionAction = "BUY" | "HOLD" | "SELL"

export interface PredictionRequest {
  userId: string
  assetId?: string
  type?: AssetType
  context?: Record<string, any>
}

export interface PredictionResponse {
  action: PredictionAction
  confidence: number // 0.0-1.0
  reason: string
}

// Rate limiting: max 3 explain calls per asset per user per hour
const explainCallTracker = new Map<string, number[]>()

export function useAiPrediction() {
  const { data, loading, error, execute } = useAiRequest<PredictionResponse>("/predict", {
    debounceMs: 600,
    cacheTTL: 2 * 60 * 1000, // 2 minutes
  })

  const predict = useCallback(
    (request: PredictionRequest) => {
      // Validate input
      if (!request.userId) {
        throw new Error("userId is required")
      }
      
      if (request.type && !["stock", "nft"].includes(request.type)) {
        throw new Error("type must be 'stock' or 'nft'")
      }

      return execute(request)
    },
    [execute]
  )

  const canExplain = useCallback((userId: string, assetId: string): boolean => {
    const key = `${userId}:${assetId}`
    const calls = explainCallTracker.get(key) || []
    
    // Filter calls from last hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recentCalls = calls.filter(timestamp => timestamp > oneHourAgo)
    
    return recentCalls.length < 3
  }, [])

  const trackExplainCall = useCallback((userId: string, assetId: string) => {
    const key = `${userId}:${assetId}`
    const calls = explainCallTracker.get(key) || []
    calls.push(Date.now())
    explainCallTracker.set(key, calls)
  }, [])

  return {
    prediction: data,
    loading,
    error,
    predict,
    canExplain,
    trackExplainCall
  }
}
