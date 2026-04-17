"use client"

import { FileText, Clock, User, Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ItemStatusBadge } from '@/components/dashboard/item-status-badge'
import { PriorityBadge } from '@/components/dashboard/priority-badge'
import { RiskMeter } from '@/components/dashboard/risk-meter'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { ItemStatus, Priority, RiskLevel } from '@/lib/types'

interface ItemSummaryCardProps {
  item: {
    id: string
    title: string
    status: ItemStatus
    priority?: Priority
    riskLevel?: RiskLevel
    category?: string
    summary?: string
    recommendation?: string
    sourceType: 'FILE' | 'TEXT'
    filename?: string
    createdAt: string
    confidence?: number
  }
  analysis?: {
    priorityScore: number
    riskScore: number
  }
}

export function ItemSummaryCard({ item, analysis }: ItemSummaryCardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {item.sourceType === 'FILE' ? (
                    <span>{item.filename || 'Uploaded file'}</span>
                  ) : (
                    <span>Text input</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Created {formatRelativeTime(new Date(item.createdAt))}</span>
                </div>
                {item.category && (
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{item.category}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ItemStatusBadge status={item.status} />
              {item.priority && <PriorityBadge priority={item.priority} />}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary */}
      {item.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{item.summary}</p>
            {item.confidence && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>AI Confidence: {Math.round(item.confidence * 100)}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Priority & Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Score */}
        {analysis?.priorityScore && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Priority Score</span>
                  <span className="text-2xl font-bold">{analysis.priorityScore}/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.priorityScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Critical</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Assessment */}
        {item.riskLevel && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskMeter 
                riskLevel={item.riskLevel} 
                score={analysis?.riskScore}
                size="lg"
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommendation */}
      {item.recommendation && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{item.recommendation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}