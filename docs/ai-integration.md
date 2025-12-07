# AI Integration Documentation

## Overview

This document describes the AI features integrated into the ArtShos application. All AI features are embedded inline within existing pages using small cards, badges, and widgets - **no separate AI page exists**.

## Architecture

### Components
All AI components are located in `src/components/ai/`:
- `AiInsightCard.tsx` - Generic card component for displaying AI insights
- `AiRiskBadge.tsx` - Badge showing risk score (0-100) with color coding
- `AiBuySellBadge.tsx` - Badge for Buy/Hold/Sell predictions with confidence scores
- `AiDailyBriefCard.tsx` - Dashboard component showing daily portfolio summary
- `AiExpenseInsights.tsx` - Expense page component with spending predictions

### Hooks
All AI hooks are located in `src/hooks/ai/`:
- `useAiRequest.ts` - Generic AI request hook with debouncing, caching, and error handling
- `useAiPrediction.ts` - Specialized hook for asset prediction with rate limiting

### Context
- `src/contexts/AiContext.tsx` - Provides AI configuration (API keys, base URL, user ID)

## API Endpoints

All AI endpoints are prefixed with `/api/ai/`

### 1. Daily Brief
**Endpoint:** `GET /api/ai/daily-brief?userId={userId}`

**Response:**
```json
{
  "summary": "Portfolio up 2.3% today. Top asset: ETH/NFT-Alpha.",
  "riskScore": 62,
  "highlights": [
    { "assetId": "eth-001", "delta": 2.3 }
  ],
  "suggestions": [
    "Reduce exposure to volatile NFT collections",
    "Consider adding stable coins to balance portfolio"
  ]
}
```

**Cache TTL:** 5 minutes

---

### 2. Predict (Buy/Hold/Sell)
**Endpoint:** `POST /api/ai/predict`

**Request Body:**
```json
{
  "userId": "user-123",
  "assetId": "nft-collection-1",
  "type": "nft",
  "context": {}
}
```

**Response:**
```json
{
  "action": "BUY",
  "confidence": 0.75,
  "reason": "Strong community and holder base. Minor dip presents buying opportunity."
}
```

**Cache TTL:** 2 minutes  
**Rate Limit:** Max 3 explain calls per asset per user per hour

---

### 3. Expense Insights
**Endpoint:** `GET /api/ai/expenses-insight?userId={userId}`

**Response:**
```json
{
  "predictedTotal": 3240.50,
  "biggestGrowthCategory": "Dining & Entertainment",
  "optimizationTip": "You could save $280/month by reducing dining expenses by 15%.",
  "uncategorizedCount": 7
}
```

**Cache TTL:** 3 minutes

---

### 4. Auto-Categorize Transactions
**Endpoint:** `POST /api/transactions/auto-categorize`

**Request Body:**
```json
{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "categorized": 7,
  "success": true
}
```

---

### 5. Asset Analysis
**Endpoint:** `POST /api/ai/asset-analysis`

**Request Body:**
```json
{
  "assetId": "nft-asset-123"
}
```

**Response:**
```json
{
  "tags": ["art", "pfp", "rare"],
  "qualityScore": 85,
  "copyrightRisk": false,
  "explanation": "High-quality artwork with verified provenance."
}
```

---

### 6. Profile Summary
**Endpoint:** `GET /api/ai/profile-summary?userId={userId}`

**Response:**
```json
{
  "riskProfile": "Moderate risk, long-term investor",
  "recommendedActions": ["Diversify holdings", "Increase stable assets"],
  "lastGenerated": "2025-12-01T10:30:00Z"
}
```

**Cache TTL:** 24 hours  
**Rate Limit:** Once per 24 hours

---

## Caching Policy

The frontend implements client-side caching using an in-memory Map:

- **Daily Brief:** 5 minutes
- **Predictions:** 2 minutes
- **Expense Insights:** 3 minutes
- **Profile Summary:** 24 hours

Cache keys are generated from endpoint + request body JSON.

## Debouncing

User-triggered AI calls are debounced:
- Search/predict inputs: 600ms
- Heavy/expensive operations: 1500ms

## Rate Limiting

### Explain Calls
Maximum 3 explain calls per asset per user per hour, tracked client-side in `useAiPrediction`.

### Profile Regeneration
Once per 24 hours per user.

## Error Handling

All components gracefully handle errors:
- **Network errors:** Show "AI service temporarily unavailable"
- **Non-critical features:** Fail silently (e.g., expense insights)
- **Loading states:** Display skeleton loaders using `Skeleton` component

## Mock Data

All components include mock data for development. When the backend is unavailable, components fall back to mock responses. Remove mock data when backend is ready.

## Integration Points

### Dashboard Page (`src/pages/DashboardPage.tsx`)
- Added `AiDailyBriefCard` as a 4th card in the grid
- Shows portfolio summary, risk score, and suggestions

### NFT Marketplace (`src/components/marketplace/FeaturedCollections.tsx`)
- Added `AiBuySellBadge` below each collection card
- Shows AI buy/sell/hold recommendations with confidence scores

### Expenses Page (Future)
- Will integrate `AiExpenseInsights` component
- Shows spending forecast and auto-categorization

## Accessibility

- All badges and tooltips have `aria-label` attributes
- Interactive elements are keyboard accessible
- Disclaimer text included: "AI suggestion for informational purposes only. Do your own research."

## Privacy & Safety

- No file binaries sent to third-party services unless user explicitly allows
- All predictions include confidence scores and reasoning
- Never auto-execute trades - AI is advisory only
- Clear disclaimers on all trading suggestions

## Testing

Mock implementations are provided for all API endpoints. To test:

1. Components render with loading states
2. Mock data displays correctly
3. Error states show appropriate messages
4. Cache prevents duplicate requests
5. Debouncing delays rapid requests

## Next Steps

1. Implement real backend AI endpoints
2. Remove mock data from components
3. Add unit tests for hooks and components
4. Integrate with authentication for real user IDs
5. Add more AI features to other pages (Transactions, Profile, etc.)

## Configuration

Update `AiProvider` in your root component:

```tsx
<AiProvider
  apiKey={process.env.REACT_APP_AI_API_KEY}
  baseUrl="/api/ai"
  userId={currentUser?.id}
>
  <App />
</AiProvider>
```

## Model Keys & Configuration

AI service configuration should be stored in environment variables:

```
REACT_APP_AI_API_KEY=your-api-key
REACT_APP_AI_BASE_URL=https://api.example.com/ai
```

Backend should handle model selection and API keys securely.
