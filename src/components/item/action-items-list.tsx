"use client"

import { useState } from 'react'
import { CheckCircle, Circle, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ActionItem {
  id: string
  text: string
  completed: boolean
}

interface ActionItemsListProps {
  actionItems: string[]
  className?: string
}

export function ActionItemsList({ actionItems, className }: ActionItemsListProps) {
  const [items, setItems] = useState<ActionItem[]>(
    actionItems.map((text, index) => ({
      id: `item-${index}`,
      text,
      completed: false
    }))
  )

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length

  if (actionItems.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No action items identified</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Action Items</CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedCount}/{totalCount} completed
          </div>
        </div>
        {totalCount > 0 && (
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border border-border/50 transition-all duration-200",
                item.completed ? "bg-green-500/5 border-green-500/20" : "bg-card hover:bg-accent/50"
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 mt-0.5 flex-shrink-0"
                onClick={() => toggleItem(item.id)}
              >
                {item.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm leading-relaxed",
                  item.completed ? "line-through text-muted-foreground" : "text-foreground"
                )}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {completedCount === totalCount && totalCount > 0 && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">All action items completed!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}