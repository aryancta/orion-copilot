"use client"

import { Badge } from '@/components/ui/badge'
import { Priority } from '@/lib/types'
import { cn } from '@/lib/utils'
import { AlertTriangle, Minus, TrendingUp, Zap } from 'lucide-react'

interface PriorityBadgeProps {
  priority: Priority
  className?: string
  showIcon?: boolean
}

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const priorityConfig = {
    LOW: {
      label: 'Low',
      icon: Minus,
      className: 'priority-badge-low'
    },
    MEDIUM: {
      label: 'Medium',
      icon: TrendingUp,
      className: 'priority-badge-medium'
    },
    HIGH: {
      label: 'High',
      icon: AlertTriangle,
      className: 'priority-badge-high'
    },
    CRITICAL: {
      label: 'Critical',
      icon: Zap,
      className: 'priority-badge-critical'
    }
  }

  const config = priorityConfig[priority]
  const IconComponent = config.icon

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium border',
        config.className,
        className
      )}
    >
      {showIcon && <IconComponent className="h-3 w-3" />}
      {config.label}
    </Badge>
  )
}