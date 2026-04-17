"use client"

import { TrendingUp, Clock, Users, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ImpactMetricsProps {
  metrics: {
    totalItems: number
    estimatedTimeSaved: number
    processingRate: number
    criticalItems: number
  }
  isLoading?: boolean
}

export function ImpactMetrics({ metrics, isLoading }: ImpactMetricsProps) {
  const cards = [
    {
      title: 'Total Items Processed',
      value: metrics.totalItems,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      suffix: '',
      description: 'Documents analyzed'
    },
    {
      title: 'Time Saved',
      value: `${Math.round(metrics.estimatedTimeSaved / 60)}`,
      icon: Clock,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      suffix: 'hours',
      description: 'Manual work automated'
    },
    {
      title: 'Processing Rate',
      value: `${Math.round(metrics.processingRate * 100)}`,
      icon: Zap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      suffix: '%',
      description: 'Items completed'
    },
    {
      title: 'Critical Items',
      value: metrics.criticalItems,
      icon: Users,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      suffix: '',
      description: 'High priority items'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={card.title} className="gradient-card border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", card.bgColor)}>
                  <card.icon className={cn("h-6 w-6", card.color)} />
                </div>
                <div className="text-right">
                  {isLoading ? (
                    <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                  ) : (
                    <div className="flex items-baseline space-x-1">
                      <span className={cn("text-3xl font-bold", card.color)}>
                        {card.value}
                      </span>
                      {card.suffix && (
                        <span className="text-sm text-muted-foreground">{card.suffix}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">{card.title}</h3>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
            </div>
            
            {/* Animated bottom accent */}
            <div className={cn("h-1 w-full", card.bgColor)}>
              <div 
                className={cn("h-full transition-all duration-1000 ease-out", card.color.replace('text-', 'bg-'))}
                style={{ 
                  width: isLoading ? '0%' : '100%',
                  transitionDelay: `${index * 200}ms`
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}