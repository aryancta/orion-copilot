"use client"

import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KPICardsProps {
  metrics: {
    totalItems: number
    urgentItems: number
    resolvedItems: number
    estimatedTimeSaved: number
  }
  isLoading?: boolean
}

export function KPICards({ metrics, isLoading }: KPICardsProps) {
  const cards = [
    {
      title: 'Total Items',
      value: metrics.totalItems,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      suffix: ''
    },
    {
      title: 'Urgent Items',
      value: metrics.urgentItems,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      suffix: ''
    },
    {
      title: 'Resolved Items', 
      value: metrics.resolvedItems,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      suffix: ''
    },
    {
      title: 'Time Saved',
      value: Math.round(metrics.estimatedTimeSaved / 60),
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      suffix: 'hrs'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <div className="flex items-baseline space-x-1">
                  {isLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                  ) : (
                    <>
                      <span className="text-2xl font-bold">{card.value}</span>
                      {card.suffix && (
                        <span className="text-sm text-muted-foreground">{card.suffix}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", card.bgColor)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
            </div>
            
            {/* Progress indicator for some cards */}
            {card.title === 'Resolved Items' && !isLoading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Resolution Rate</span>
                  <span>{Math.round((metrics.resolvedItems / (metrics.totalItems || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(metrics.resolvedItems / (metrics.totalItems || 1)) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            {card.title === 'Urgent Items' && !isLoading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Urgency Rate</span>
                  <span>{Math.round((metrics.urgentItems / (metrics.totalItems || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(metrics.urgentItems / (metrics.totalItems || 1)) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}