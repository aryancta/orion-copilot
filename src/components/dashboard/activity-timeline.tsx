"use client"

import { Clock, FileText, Brain, CheckCircle, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ActivityItem {
  id: string
  title: string
  category?: string
  priority?: string
  createdAt: string
  type: 'analysis_completed' | 'item_resolved' | 'item_uploaded'
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
  isLoading?: boolean
}

export function ActivityTimeline({ activities, isLoading }: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'item_uploaded': return FileText
      case 'analysis_completed': return Brain
      case 'item_resolved': return CheckCircle
      default: return AlertTriangle
    }
  }

  const getActivityColor = (priority?: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-400'
      case 'HIGH': return 'text-orange-400'
      case 'MEDIUM': return 'text-yellow-400'
      case 'LOW': return 'text-slate-400'
      default: return 'text-blue-400'
    }
  }

  const getActivityMessage = (item: ActivityItem) => {
    switch (item.type) {
      case 'item_uploaded':
        return `New item uploaded: ${item.title}`
      case 'analysis_completed':
        return `Analysis completed for: ${item.title}`
      case 'item_resolved':
        return `Item resolved: ${item.title}`
      default:
        return item.title
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest system activities and updates
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type)
            const color = getActivityColor(activity.priority)
            
            return (
              <div key={activity.id} className="relative">
                {/* Timeline line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                )}
                
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background",
                    color.replace('text-', 'border-')
                  )}>
                    <IconComponent className={cn("h-4 w-4", color)} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getActivityMessage(activity)}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatRelativeTime(new Date(activity.createdAt))}</span>
                        {activity.category && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {activity.category}
                            </span>
                          </>
                        )}
                        {activity.priority && (
                          <>
                            <span>•</span>
                            <span className={cn("font-medium", color)}>
                              {activity.priority}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {activities.length > 0 && (
          <div className="pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Showing {activities.length} most recent activities
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}