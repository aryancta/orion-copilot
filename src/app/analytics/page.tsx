"use client"

import { AppShell } from '@/components/layout/app-shell'
import { ImpactMetrics } from '@/components/dashboard/impact-metrics'
import { PriorityChart } from '@/components/dashboard/priority-chart'
import { TrendChart } from '@/components/dashboard/trend-chart'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'
import { useAnalytics } from '@/hooks/use-analysis'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Clock, Award, Zap } from 'lucide-react'

export default function AnalyticsPage() {
  const { activeWorkspace } = useAppStore()
  const { data: analytics, isLoading } = useAnalytics(activeWorkspace?.id)

  const impactMetrics = analytics ? {
    totalItems: analytics.totals.totalItems,
    estimatedTimeSaved: analytics.totals.estimatedTimeSaved,
    processingRate: analytics.totals.processingRate,
    criticalItems: analytics.totals.criticalItems
  } : {
    totalItems: 0,
    estimatedTimeSaved: 0,
    processingRate: 0,
    criticalItems: 0
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Impact</h1>
            <p className="text-muted-foreground">
              Measure productivity gains and workflow insights
            </p>
          </div>
        </div>

        {/* Hero Impact Section */}
        <Card className="gradient-card border-primary/20 bg-primary/5">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div>
                <h2 className="text-4xl font-bold text-primary mb-2">
                  {isLoading ? (
                    <div className="h-12 w-32 bg-muted animate-pulse rounded mx-auto" />
                  ) : (
                    `${Math.round(impactMetrics.estimatedTimeSaved / 60)} Hours`
                  )}
                </h2>
                <p className="text-xl text-muted-foreground">
                  Total time saved through AI automation
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-lg font-semibold text-green-400">
                      {isLoading ? '—' : `${Math.round(impactMetrics.processingRate * 100)}%`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-lg font-semibold text-blue-400">
                      {isLoading ? '—' : '2.5s'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-lg font-semibold text-purple-400">
                      {isLoading ? '—' : impactMetrics.totalItems}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Items Processed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics Cards */}
        <ImpactMetrics metrics={impactMetrics} isLoading={isLoading} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PriorityChart 
            data={analytics?.distributions?.priority || []}
            isLoading={isLoading}
          />
          
          <CategoryChart 
            data={analytics?.distributions?.category || []}
            isLoading={isLoading}
          />
        </div>

        {/* Trend and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrendChart 
              data={analytics?.trends?.processingVolume || []}
              isLoading={isLoading}
            />
          </div>
          
          <ActivityTimeline 
            activities={analytics?.recentActivity || []}
            isLoading={isLoading}
          />
        </div>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Productivity Impact Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {isLoading ? '—' : `$${Math.round((impactMetrics.estimatedTimeSaved / 60) * 50)}`}
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated Cost Savings
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Based on $50/hour rate
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {isLoading ? '—' : `${Math.round(impactMetrics.totalItems / 7)}`}
                </div>
                <div className="text-sm text-muted-foreground">
                  Items per Day
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Weekly average
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {isLoading ? '—' : '94%'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Accuracy Rate
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  AI classification accuracy
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  {isLoading ? '—' : `${Math.round((impactMetrics.criticalItems / impactMetrics.totalItems || 1) * 100)}%`}
                </div>
                <div className="text-sm text-muted-foreground">
                  Critical Items
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Requiring immediate attention
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}