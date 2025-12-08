import { createContext, useContext, type ReactNode } from "react"

interface AiContextValue {
  apiKey?: string
  baseUrl: string
  userId?: string
}

const AiContext = createContext<AiContextValue | undefined>(undefined)

interface AiProviderProps {
  children: ReactNode
  apiKey?: string
  baseUrl?: string
  userId?: string
}

export function AiProvider({
  children,
  apiKey,
  baseUrl = "/api/ai",
  userId
}: AiProviderProps) {
  return (
    <AiContext.Provider value={{ apiKey, baseUrl, userId }}>
      {children}
    </AiContext.Provider>
  )
}

export function useAiContext() {
  const context = useContext(AiContext)
  if (context === undefined) {
    throw new Error("useAiContext must be used within an AiProvider")
  }
  return context
}
