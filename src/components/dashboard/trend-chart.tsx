"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TrendChartProps {
  data: Array<{
    date: string
    count: number
    cumulative?: number
  }>
  isLoading?: boolean
}

export function TrendChart({ data, isLoading }: TrendChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Volume (Last 30 Days)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Daily item processing and cumulative totals
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-muted-foreground text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-muted-foreground text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                labelFormatter={(value) => formatDate(value as string)}
                formatter={(value: number, name: string) => [
                  value,
                  name === 'count' ? 'Daily Items' : 'Cumulative'
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.1}
                strokeWidth={2}
                dot={{ r: 3, fill: '#0ea5e9' }}
                activeDot={{ r: 5, fill: '#0ea5e9' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <span>
            Total: {data.reduce((sum, item) => sum + item.count, 0)} items
          </span>
          <span>
            Avg: {Math.round(data.reduce((sum, item) => sum + item.count, 0) / data.length)} per day
          </span>
        </div>
      </CardContent>
    </Card>
  )
}