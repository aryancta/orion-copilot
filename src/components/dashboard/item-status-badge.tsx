"use client"

import { Badge } from '@/components/ui/badge'
import { ItemStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Loader2, CheckCircle, XCircle, Clock, CheckCircle2 } from 'lucide-react'

interface ItemStatusBadgeProps {
  status: ItemStatus
  className?: string
}

export function ItemStatusBadge({ status, className }: ItemStatusBadgeProps) {
  const statusConfig = {
    QUEUED: {
      label: 'Queued',
      icon: Clock,
      className: 'status-badge-queued'
    },
    PROCESSING: {
      label: 'Processing',
      icon: Loader2,
      className: 'status-badge-processing'
    },
    COMPLETED: {
      label: 'Completed',
      icon: CheckCircle,
      className: 'status-badge-completed'
    },
    FAILED: {
      label: 'Failed',
      icon: XCircle,
      className: 'status-badge-failed'
    },
    RESOLVED: {
      label: 'Resolved',
      icon: CheckCircle2,
      className: 'status-badge-resolved'
    }
  }

  const config = statusConfig[status]
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
      <IconComponent className={cn(
        'h-3 w-3',
        status === 'PROCESSING' && 'animate-spin'
      )} />
      {config.label}
    </Badge>
  )
}