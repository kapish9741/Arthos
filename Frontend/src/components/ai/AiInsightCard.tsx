import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface AiInsightCardProps {
  title: string
  description?: string
  content: React.ReactNode
  actions?: React.ReactNode
  loading?: boolean
  className?: string
}

export function AiInsightCard({
  title,
  description,
  content,
  actions,
  loading = false,
  className
}: AiInsightCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-blue-400">✨</span>
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{content}</CardContent>
      {actions && <CardFooter>{actions}</CardFooter>}
    </Card>
  )
}
