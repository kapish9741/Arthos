import { useState, useEffect, useCallback, useRef } from "react"

interface UseAiRequestOptions {
  debounceMs?: number
  cacheTTL?: number // milliseconds
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface CacheEntry {
  data: any
  timestamp: number
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry>()

export function useAiRequest<T = any>(
  endpoint: string,
  options: UseAiRequestOptions = {}
) {
  const {
    debounceMs = 600,
    cacheTTL = 2 * 60 * 1000, // 2 minutes default
    onSuccess,
    onError
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceTimerRef = useRef<number | null>(null)

  const getCacheKey = (url: string, body?: any) => {
    return `${url}:${JSON.stringify(body || {})}`
  }

  const getFromCache = (key: string): T | null => {
    const entry = cache.get(key)
    if (!entry) return null
    
    const isExpired = Date.now() - entry.timestamp > cacheTTL
    if (isExpired) {
      cache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  const setInCache = (key: string, data: T) => {
    cache.set(key, { data, timestamp: Date.now() })
  }

  const execute = useCallback(
    async (body?: any, skipDebounce = false) => {
      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      const makeRequest = async () => {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        const cacheKey = getCacheKey(endpoint, body)
        
        // Check cache
        const cachedData = getFromCache(cacheKey)
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
          onSuccess?.(cachedData)
          return cachedData
        }

        setLoading(true)
        setError(null)

        const controller = new AbortController()
        abortControllerRef.current = controller

        try {
          const response = await fetch(`/api/ai${endpoint}`, {
            method: body ? "POST" : "GET",
            headers: {
              "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          })

          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`)
          }

          const result = await response.json()
          setData(result)
          setInCache(cacheKey, result)
          onSuccess?.(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.name !== "AbortError") {
            setError(err)
            onError?.(err)
          }
          return null
        } finally {
          setLoading(false)
        }
      }

      if (skipDebounce || debounceMs === 0) {
        return makeRequest()
      }

      // Debounce the request
      debounceTimerRef.current = setTimeout(makeRequest, debounceMs)
    },
    [endpoint, debounceMs, cacheTTL, onSuccess, onError]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    refetch: () => execute(undefined, true)
  }
}
